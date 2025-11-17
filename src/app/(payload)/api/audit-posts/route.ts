import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Custom API route to run the audit job immediately and return results
 * This queues the job, runs it immediately, and returns the output
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Parse request body
    const body = await req.json()
    const { limit = 50, includeUnpublished = false, autoFix = false } = body

    // Queue the job
    const job = await payload.jobs.queue({
      task: 'auditPostRelationships',
      input: { limit, includeUnpublished, autoFix },
      queue: 'default',
    })

    if (!job?.id) {
      throw new Error('Failed to create job')
    }

    payload.logger.info({ jobId: job.id }, 'Queued auditPostRelationships job')

    // Run this specific job immediately by filtering with where clause
    // payload.jobs.run() returns { jobStatus: Record<jobId, { status }>, ... }
    const runResult = await payload.jobs.run({
      where: {
        id: {
          equals: job.id,
        },
      },
      queue: 'default',
      limit: 1,
    })

    payload.logger.info({ jobId: job.id, runResult }, 'Executed auditPostRelationships job')

    // Check if job was executed
    const jobStatus = runResult?.jobStatus?.[job.id]

    if (!jobStatus) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job was not executed',
        },
        { status: 500 },
      )
    }

    // Check if job execution succeeded
    if (jobStatus.status !== 'success') {
      return NextResponse.json(
        {
          success: false,
          error: `Job execution failed with status: ${jobStatus.status}`,
        },
        { status: 500 },
      )
    }

    // Now fetch the job document to get the output
    const completedJob = await payload.findByID({
      collection: 'payload-jobs',
      id: job.id,
      depth: 0,
    })

    payload.logger.info({ completedJob }, 'Fetched completed job after execution')

    // Extract output from the task status
    // The structure is: taskStatus.{taskSlug}.{taskID}.output
    const taskStatus = completedJob.taskStatus as any
    const taskSlug = 'auditPostRelationships'

    // Find the task execution (usually taskID "1" for the first/only execution)
    let output = null
    if (taskStatus?.[taskSlug]) {
      // Get the first task execution result (could be taskID "1", "2", etc.)
      const taskExecutions = taskStatus[taskSlug]
      const firstExecutionKey = Object.keys(taskExecutions)[0]
      if (firstExecutionKey) {
        output = taskExecutions[firstExecutionKey]?.output
      }
    }

    if (output) {
      return NextResponse.json({
        success: true,
        output,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Job completed but did not return output',
          taskStatus: completedJob.taskStatus,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error running audit job:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
