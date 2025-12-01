// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { z } from 'zod'
import { auditPostRelationshipsJob } from './jobs/auditPostRelationshipsJob'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { isAdmin } from './access/isAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: [
        //'@/components/PostRelationshipsAuditDashboard#PostRelationshipsAuditDashboard',
        // '@/components/BeforeDashboard',
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  plugins: [
    ...plugins,
    mcpPlugin({
      collections: {
        posts: {
          description: 'Company blog posts that can be read or updated',
          enabled: { find: true, update: true },
        },
        categories: {
          description: 'Company blog categories that can be read or updated',
          enabled: { find: true, update: true },
        },
      },
      overrideApiKeyCollection: (collection) => {
        collection.access = {
          create: isAdmin,
          read: ({ req: { user } }) => {
            // admins can see all keys, users can see their own
            if (user?.collection === 'users' && user.roles?.includes('admin')) return true
            return { user: { equals: user?.id } }
          },
          update: isAdmin,
          delete: isAdmin,
        }
        collection.admin = {
          ...collection.admin,
          hidden: ({ user }) => {
            // hide API Key collection from non-admins in the sidebar
            return !(user?.collection === 'users' && user.roles?.includes('admin'))
          },
        }
        return collection
      }
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    deleteJobOnComplete: false,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      defaultJobsCollection.admin ||= {}
      defaultJobsCollection.admin.hidden = false
      return defaultJobsCollection
    },
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [auditPostRelationshipsJob],
  },
  onInit: async (payload) => {
    // Check if we should run the audit job on startup
    if (process.env.RUN_AUDIT_JOB !== '1') return

    const limit = parseInt(process.env.AUDIT_LIMIT || '50')
    const includeUnpublished = process.env.AUDIT_INCLUDE_UNPUBLISHED === '1'
    const autoFix = process.env.AUDIT_AUTO_FIX === '1'

    payload.logger.info('[onInit] Queueing audit post relationships job...')
    payload.logger.info(
      `[onInit] Parameters: limit=${limit}, includeUnpublished=${includeUnpublished}, autoFix=${autoFix}`,
    )

    try {
      const job = await payload.jobs.queue({
        task: 'auditPostRelationships',
        input: {
          limit,
          includeUnpublished,
          autoFix,
        },
        queue: 'default',
      })

      payload.logger.info(`[onInit] ✅ Job queued with ID: ${job.id}`)

      // Optionally run the job immediately instead of waiting for a worker
      if (process.env.RUN_JOB_IMMEDIATELY === '1') {
        payload.logger.info('[onInit] Running job immediately...')

        const result = await payload.jobs.run({
          queue: 'default',
          limit: 1, // Process 1 job from the queue
        })

        payload.logger.info(`[onInit] ✅ Job execution result: ${JSON.stringify(result)}`)
      }
    } catch (error) {
      payload.logger.error(`[onInit] ❌ Failed to queue/run audit job: ${error}`)
    }
  },
})
