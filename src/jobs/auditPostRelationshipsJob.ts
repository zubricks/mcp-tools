import type { TaskConfig } from 'payload'
import { auditPostRelationships } from './auditPostRelationships'

export const auditPostRelationshipsJob: TaskConfig = {
  slug: 'auditPostRelationships',
  label: 'Audit Post Relationships',
  queue: 'default',
  interfaceName: 'AuditPostRelationshipsTask',
  handler: async ({ input, req }) => {
    const { payload } = req

    try {
      // Get parameters from task input
      const limit = ((input as any)?.limit as number | undefined) || 50
      const includeUnpublished = ((input as any)?.includeUnpublished as boolean | undefined) || false
      const autoFix = ((input as any)?.autoFix as boolean | undefined) || false

      payload.logger.info(
        `[Task: auditPostRelationships] Starting with params: limit=${limit}, includeUnpublished=${includeUnpublished}, autoFix=${autoFix}`,
      )

      // Run the audit
      const result = await auditPostRelationships(limit, includeUnpublished, autoFix, req)

      // Calculate summary statistics
      const totalAudited =
        result.missingBoth.length +
        result.missingCategories.length +
        result.missingRelatedPosts.length +
        result.complete.length

      const totalIssues =
        result.missingBoth.length +
        result.missingCategories.length +
        result.missingRelatedPosts.length

      const healthScore =
        totalAudited > 0 ? Math.round((result.complete.length / totalAudited) * 100) : 100

      // Return comprehensive result
      const output = {
        success: true,
        summary: {
          totalAudited,
          totalIssues,
          healthScore,
          autoFixApplied: autoFix,
        },
        breakdown: {
          missingBoth: result.missingBoth.length,
          missingCategories: result.missingCategories.length,
          missingRelatedPosts: result.missingRelatedPosts.length,
          complete: result.complete.length,
        },
        details: {
          missingBoth: result.missingBoth,
          missingCategories: result.missingCategories,
          missingRelatedPosts: result.missingRelatedPosts,
          complete: result.complete,
        },
      }

      payload.logger.info(
        `[Task: auditPostRelationships] ✅ Complete! Health Score: ${healthScore}%, Issues: ${totalIssues}`,
      )

      return { output, state: 'succeeded' }
    } catch (error) {
      payload.logger.error(`[Task: auditPostRelationships] ❌ Failed: ${error}`)

      return {
        state: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
  inputSchema: [
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum number of posts to audit',
      defaultValue: 50,
      min: 1,
      max: 500,
      required: false,
    },
    {
      name: 'includeUnpublished',
      type: 'checkbox',
      label: 'Include unpublished/draft posts',
      defaultValue: false,
      required: false,
    },
    {
      name: 'autoFix',
      type: 'checkbox',
      label: 'Automatically fix missing relationships',
      defaultValue: false,
      required: false,
    },
  ],
}
