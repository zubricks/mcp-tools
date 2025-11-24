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
        '@/components/PostRelationshipsAuditDashboard#PostRelationshipsAuditDashboard',
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
          description: 'Company blog posts that can be read',
          enabled: { find: true, update: true },
        },
      },
      overrideApiKeyCollection: (collection) => {
        collection.access = {
          create: isAdmin,
          read: ({ req: { user } }) => {
            // Admins can see all keys, users can see their own
            if (user?.collection === 'users' && user.roles?.includes('admin')) return true
            return { user: { equals: user?.id } }
          },
          update: isAdmin,
          delete: isAdmin,
        }
        collection.admin = {
          ...collection.admin,
          hidden: ({ user }) => {
            // Hide collection from non-admins in the sidebar
            return !(user?.collection === 'users' && user.roles?.includes('admin'))
          },
        }
        return collection
      }
      // mcp: {
      //   tools: [
      //     {
      //       name: 'analyzeContentHealth',
      //       description:
      //         'Comprehensive content audit of all published posts with actionable insights',
      //       // IMPORTANT: pass a ZodRawShape by using `.shape`
      //       parameters: z.object({
      //         limit: z
      //           .number()
      //           .int()
      //           .positive()
      //           .max(100)
      //           .default(50)
      //           .describe('Maximum number of posts to analyze (default: 50, max: 100)'),
      //         includeUnpublished: z
      //           .boolean()
      //           .default(false)
      //           .describe('Include draft/unpublished posts in analysis (default: false)'),
      //       }).shape,

      //       handler: async (args: Record<string, unknown>) => {
      //         const limit = (args.limit as number) ?? 50
      //         const includeUnpublished = (args.includeUnpublished as boolean) ?? false

      //         const statusFilter = includeUnpublished
      //           ? ''
      //           : ' and where[_status][equals]="published"'

      //         // Return instructions for the MCP client to use the built-in findPosts tool
      //         const text = `To perform a comprehensive content health audit, please:

      //           1. Use the "findPosts" tool with limit=${limit}${statusFilter} to fetch all posts for analysis

      //           2. For each post, calculate and analyze:

      //             **Content Metrics:**
      //             - Reading time (estimated based on word count: ~200 words per minute)
      //             - Content length (word count)
      //             - Sentiment analysis (positive/neutral/negative tone)
      //             - Freshness score (days since last update)
      //             - Title length (character count and SEO friendliness: 50-60 chars optimal)
      //             - Meta description presence and quality (150-160 chars optimal)
      //             - Keyword density and primary topics
      //             - Content structure (headings, paragraphs, readability)

      //           3. Categorize issues and create prioritized lists:

      //             **🚨 Critical Issues (Fix Immediately):**
      //             - Posts with missing meta descriptions
      //             - Posts with titles too long (>70 chars) or too short (<30 chars)
      //             - Posts with no content or very thin content (<300 words)

      //             **⚠️ High Priority (Fix This Week):**
      //             - Outdated posts (>365 days since last update)
      //             - Posts with poor readability scores
      //             - Posts missing featured images or media
      //             - Posts with broken internal structure

      //             **📊 Medium Priority (Fix This Month):**
      //             - Posts needing content refresh (180-365 days old)
      //             - Posts with suboptimal keyword usage
      //             - Posts with low engagement potential (based on title/intro analysis)

      //             **💡 Content Strategy Insights:**
      //             - Topic overlap analysis: Identify posts covering similar topics that could be merged or better differentiated
      //             - Content gaps: Suggest topics that are underrepresented
      //             - Top performing content patterns (based on structure, length, tone)
      //             - Seasonal content that needs updating

      //           4. Format your response as a comprehensive audit report:

      //           ---
      //           # 📋 Content Health Audit Report
      //           **Analysis Date:** [Current Date]
      //           **Total Posts Analyzed:** [X]
      //           **Status:** [Published only / Including drafts]

      //           ## Executive Summary
      //           [2-3 sentence overview of overall content health]

      //           ---

      //           ## 🚨 Critical Issues ([X] posts)

      //           ### Missing Meta Descriptions ([X] posts)
      //           - **[Post Title]** (slug: \`post-slug\`) — Published: [date]
      //             - Impact: Poor search engine visibility
      //             - Action: Add 150-160 char meta description

      //           [Repeat for each critical issue category]

      //           ---

      //           ## ⚠️ High Priority ([X] posts)

      //           ### Outdated Content ([X] posts)
      //           - **[Post Title]** (slug: \`post-slug\`) — Last updated: [X days ago]
      //             - Freshness score: [score]/100
      //             - Action: Review and update statistics, links, and examples

      //           [Repeat for each high priority category]

      //           ---

      //           ## 📊 Medium Priority ([X] posts)

      //           ### Content Needing Refresh ([X] posts)
      //           [List with recommended actions]

      //           ---

      //           ## 💡 Content Strategy Insights

      //           ### Topic Overlap Analysis
      //           **Overlapping Topic: [Topic Name]**
      //           - \`post-1-slug\` — [Post Title 1]
      //           - \`post-2-slug\` — [Post Title 2]
      //           - **Recommendation:** Consider merging into comprehensive guide or better differentiate angles

      //           [Repeat for other overlapping topics]

      //           ### Content Performance Patterns
      //           - **Average reading time:** [X] minutes
      //           - **Most common content length:** [X] words
      //           - **Dominant sentiment:** [Positive/Neutral/Negative]
      //           - **Peak publishing days:** [Analysis of posting schedule]

      //           ### Recommended Content Gaps
      //           1. [Gap topic 1] — [Why this would be valuable]
      //           2. [Gap topic 2] — [Why this would be valuable]
      //           3. [Gap topic 3] — [Why this would be valuable]

      //           ---

      //           ## 📈 Overall Health Score: [X]/100

      //           **Breakdown:**
      //           - SEO Optimization: [X]/25
      //           - Content Freshness: [X]/25
      //           - Technical Quality: [X]/25
      //           - Strategic Alignment: [X]/25

      //           **Next Steps:**
      //           1. [Most important action]
      //           2. [Second most important action]
      //           3. [Third most important action]

      //           ---

      //           5. Be thorough and analytical. Provide specific, actionable recommendations based on content marketing best practices.`

      //         return { content: [{ type: 'text' as const, text }] }
      //       },
      //     },
      //     {
      //       name: 'auditPostRelationships',
      //       description:
      //         'Audit blog posts to ensure they have categories assigned and related posts linked',
      //       // IMPORTANT: pass a ZodRawShape by using `.shape`
      //       parameters: z.object({
      //         limit: z
      //           .number()
      //           .int()
      //           .positive()
      //           .max(100)
      //           .default(50)
      //           .describe('Maximum number of posts to audit (default: 50, max: 100)'),
      //         includeUnpublished: z
      //           .boolean()
      //           .default(false)
      //           .describe('Include draft/unpublished posts in audit (default: false)'),
      //         autoFix: z
      //           .boolean()
      //           .default(false)
      //           .describe('Automatically suggest fixes for missing relationships (default: false)'),
      //       }).shape,

      //       handler: async (args: Record<string, unknown>) => {
      //         const limit = (args.limit as number) ?? 50
      //         const includeUnpublished = (args.includeUnpublished as boolean) ?? false
      //         const autoFix = (args.autoFix as boolean) ?? false

      //         const statusFilter = includeUnpublished
      //           ? ''
      //           : ' and where[_status][equals]="published"'

      //         // Return instructions for the MCP client to use the built-in findPosts tool
      //         const text = `To audit post relationships (categories and related posts), please:

      //         1. Use the "findPosts" tool with limit=${limit}${statusFilter} to fetch all posts for analysis

      //         2. For each post, check the following relationship fields:
      //           - **categories**: Array field - should contain at least one category
      //           - **relatedPosts**: Array field - should contain at least one related post
      //           - **populatedAuthors**: Array field - check if authors are properly assigned (bonus check)

      //         3. Categorize posts by their relationship status:

      //           **🔴 Missing Both (Critical):**
      //           Posts that have NEITHER categories NOR related posts assigned

      //           **🟡 Missing Categories:**
      //           Posts that have related posts but NO categories assigned

      //           **🟠 Missing Related Posts:**
      //           Posts that have categories but NO related posts linked

      //           **✅ Complete:**
      //           Posts that have BOTH categories AND related posts assigned

      //         4. Format your response as a detailed relationship audit report:

      //         ---
      //         # 🔗 Post Relationships Audit Report
      //         **Analysis Date:** [Current Date]
      //         **Total Posts Audited:** [X]
      //         **Status:** [Published only / Including drafts]

      //         ## Executive Summary
      //         - **✅ Complete:** [X] posts ([X]%) have both categories and related posts
      //         - **🟠 Missing Related Posts:** [X] posts ([X]%) need related posts
      //         - **🟡 Missing Categories:** [X] posts ([X]%) need categories
      //         - **🔴 Missing Both:** [X] posts ([X]%) need both

      //         **Overall Relationship Score:** [X]/100
      //         (Based on: 50% for category assignment, 50% for related posts)

      //         ---

      //         ## 🔴 Missing Both Categories & Related Posts ([X] posts)

      //         These posts are completely isolated and need immediate attention:

      //         - **[Post Title]** (slug: \`post-slug\`)
      //           - Published: [date]
      //           - Authors: [list authors if available]
      //           - Topic: [infer topic from title/content]
      //           ${autoFix ? '- **Suggested Categories:** [suggest 1-2 relevant categories based on title/content]\n  - **Suggested Related Posts:** [suggest 2-3 posts that might be related based on topic]' : ''}
      //           - **Action Required:** Assign categories and link related posts

      //         ---

      //         ## 🟡 Missing Categories ([X] posts)

      //         These posts have related content linked but need categorization:

      //         - **[Post Title]** (slug: \`post-slug\`)
      //           - Published: [date]
      //           - Related Posts: [X] linked
      //           - Topic: [infer topic from title/content]
      //           ${autoFix ? '- **Suggested Categories:** [suggest 1-2 relevant categories based on title/content and related posts]' : ''}
      //           - **Action Required:** Assign appropriate categories

      //         ---

      //         ## 🟠 Missing Related Posts ([X] posts)

      //         These posts are categorized but lack internal linking:

      //         - **[Post Title]** (slug: \`post-slug\`)
      //           - Published: [date]
      //           - Categories: [list category names]
      //           - Topic: [infer topic from title/content]
      //           ${autoFix ? '- **Suggested Related Posts:** [suggest 2-3 posts from the same categories or related topics]' : ''}
      //           - **Action Required:** Link to 2-3 related posts for better content discovery

      //         ---

      //         ## ✅ Complete Posts ([X] posts)

      //         These posts have proper relationship setup:

      //         - **[Post Title]** (slug: \`post-slug\`)
      //           - Categories: [X] assigned
      //           - Related Posts: [X] linked
      //           - Status: ✓ Well connected

      //         ---

      //         ## 📊 Relationship Analytics

      //         ### Category Distribution
      //         - Total unique categories used: [X]
      //         - Most used categories:
      //           1. [Category Name] — [X] posts
      //           2. [Category Name] — [X] posts
      //           3. [Category Name] — [X] posts
      //         - Underutilized categories: [list categories with <2 posts]
      //         - **Recommendation:** [suggest if certain categories should be merged or if new ones are needed]

      //         ### Related Posts Network
      //         - Average related posts per article: [X]
      //         - Posts with most connections: [list top 3]
      //         - Isolated content clusters: [identify groups of posts that only reference each other]
      //         - **Recommendation:** [suggest how to improve content interconnection]

      //         ### Authors & Relationships
      //         - Posts with missing author info: [X]
      //         - Author with most content: [Author Name] — [X] posts
      //         - **Recommendation:** [suggest cross-author content relationships]

      //         ---

      //         ## 🎯 Priority Action Plan

      //         **Immediate Actions (This Week):**
      //         1. Fix [X] posts missing both categories and related posts
      //         2. Assign categories to [X] posts that already have related content
      //         3. [Add specific action based on findings]

      //         **Short-term Actions (This Month):**
      //         1. Add related posts to [X] categorized articles
      //         2. Review and optimize category distribution
      //         3. Create content bridges between isolated clusters

      //         **Long-term Strategy:**
      //         1. Establish guidelines for minimum relationship requirements (e.g., 1+ category, 2+ related posts)
      //         2. Implement relationship checks in editorial workflow
      //         3. Regularly audit and update relationships as content grows

      //         ---

      //         ## 💡 Best Practices Recommendations

      //         ${
      //           autoFix
      //             ? `
      //         ### Automated Fix Suggestions Available
      //         Run this tool again with the post slugs you want to update, and I can help you:
      //         1. Assign suggested categories using the "updatePosts" tool
      //         2. Link suggested related posts using the "updatePosts" tool
      //         3. Bulk update multiple posts at once

      //         **Example Update Command:**
      //         To update a post with slug \`example-post\`:
      //         \`\`\`
      //         updatePosts with:
      //         - slug: "example-post"
      //         - categories: ["category-id-1", "category-id-2"]
      //         - relatedPosts: ["post-id-1", "post-id-2", "post-id-3"]
      //         \`\`\`
      //         `
      //             : ''
      //         }

      //         ### General Guidelines:
      //         - **Categories:** Each post should have 1-3 relevant categories (avoid over-categorization)
      //         - **Related Posts:** Link 2-4 related articles to improve content discovery and SEO
      //         - **Review Frequency:** Audit relationships quarterly as content library grows
      //         - **New Content:** Ensure categories and related posts are assigned before publishing

      //         ---

      //         5. Be thorough and provide actionable insights. If autoFix is enabled, analyze content to suggest appropriate categories and related posts based on titles, topics, and existing relationships.`

      //         return { content: [{ type: 'text' as const, text }] }
      //       },
      //     },
      //   ],
      //   handlerOptions: {
      //     verboseLogs: true,
      //   },
      // },
    }),
    // storage-adapter-placeholder
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
