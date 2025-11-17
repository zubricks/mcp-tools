# Audit Post Relationships - Implementation Guide

## Overview

The `auditPostRelationships` tool has been converted from a custom MCP tool to a **Payload Job (Task)** to enable automatic updating of post relationships (categories and related posts).

## Why the Change?

**Problem**: Custom MCP tools in `@payloadcms/plugin-mcp` do not receive Payload API access in their handlers. They only get `args` as a parameter, which means:

- ❌ Cannot directly query collections
- ❌ Cannot update documents
- ❌ Can only return text instructions for the MCP client to execute

**Solution**: Convert to a Payload Job/Task which provides:

- ✅ Full Payload API access via `req.payload`
- ✅ Ability to run as background task
- ✅ Progress tracking and error handling
- ✅ Can be triggered via MCP's `runJob` tool
- ✅ Can be scheduled with cron

## Files Created

### 1. `/src/jobs/auditPostRelationships.ts`

Core logic containing:

- `suggestCategories()` - Analyzes post title/content to suggest appropriate categories
- `suggestRelatedPosts()` - Finds related posts based on category overlap
- `auditPostRelationships()` - Main audit function that can optionally auto-fix issues

### 2. `/src/jobs/auditPostRelationshipsJob.ts`

Payload Task configuration that:

- Defines the task slug as `auditPostRelationships`
- Sets up input schema (limit, includeUnpublished, autoFix)
- Wraps the audit logic in a task handler
- Returns comprehensive results

### 3. `/src/payload.config.ts` (modified)

Added the job to the `jobs.tasks` array and configured an `onInit` hook for running jobs on server startup via environment variables.

### 4. `/src/app/(payload)/api/audit-posts/route.ts`

Custom Next.js API route that:

- Queues the audit job
- Immediately runs it using `payload.jobs.run()`
- Returns results synchronously without polling
- Used by the dashboard widget for instant execution

### 5. `/src/components/PostRelationshipsAuditDashboard.tsx`

React client component that:

- Renders a visual dashboard widget in the Payload admin
- Calls the custom API route to run jobs on-demand
- Displays health score, statistics, and breakdown
- Provides "Run Audit" and "Run & Auto-Fix" buttons

## How It Works

### Audit Process

The audit categorizes posts into 4 groups:

1. **🔴 Missing Both** - Posts with NO categories AND NO related posts (critical)
2. **🟡 Missing Categories** - Posts with related posts but NO categories
3. **🟠 Missing Related Posts** - Posts with categories but NO related posts
4. **✅ Complete** - Posts with both categories AND related posts

### Auto-Fix Feature

When `autoFix: true`:

**For Categories:**

- ⚠️ **IMPORTANT**: Only uses **existing categories** from the Categories collection
- **Does NOT create new categories** - you must create categories first in Payload
- Analyzes post title/slug for keyword matches with existing categories
- Uses intelligent scoring algorithm (title match > slug match > word match)
- Suggests max 2 most relevant categories per post
- Falls back to first available category if no keyword matches
- Logs all category assignments with reasoning for review

**For Related Posts:**

- Finds posts with overlapping categories (smart matching)
- Suggests up to 3 related posts based on shared topics
- Falls back to recent posts if no category overlap found
- Ensures posts don't link to themselves

Then automatically updates the post with suggested values.

## Prerequisites

Before running the audit with `autoFix: true`, ensure you have:

1. **✅ Created Categories** in the Categories collection
   - Navigate to Categories in the Payload admin
   - Create all the categories you want to use (e.g., "Technology", "Design", "Development")
   - The tool will ONLY use existing categories - it will not create new ones

2. **✅ Have Multiple Posts** to audit
   - The tool works best with at least 5-10 posts
   - Posts should have descriptive titles for better matching

3. **⚠️ Test First** - Run with `autoFix: false` initially
   - Review what categories would be assigned
   - Check if the matches make sense
   - Only enable `autoFix: true` after reviewing

## Usage

### Via Environment Variables (On Server Startup)

You can configure the job to run automatically when the Payload server starts by setting environment variables:

**Environment Variables:**
- `RUN_AUDIT_JOB=1` - Enable the audit job to run on startup
- `AUDIT_LIMIT=50` - Number of posts to audit (default: 50)
- `AUDIT_INCLUDE_UNPUBLISHED=1` - Include unpublished/draft posts
- `AUDIT_AUTO_FIX=1` - Automatically fix missing relationships (⚠️ use with caution!)
- `RUN_JOB_IMMEDIATELY=1` - Run the job immediately instead of queueing it for a worker

**Example usage:**

```bash
# Run audit in read-only mode (recommended first run)
RUN_AUDIT_JOB=1 AUDIT_LIMIT=50 AUDIT_AUTO_FIX=0 RUN_JOB_IMMEDIATELY=1 pnpm dev

# Run audit with auto-fix enabled
RUN_AUDIT_JOB=1 AUDIT_LIMIT=100 AUDIT_AUTO_FIX=1 RUN_JOB_IMMEDIATELY=1 pnpm dev

# Queue the job for a worker to process (without immediate execution)
RUN_AUDIT_JOB=1 AUDIT_LIMIT=50 pnpm dev
```

The job will log its progress and results in the server console.

### Via MCP Client

You can trigger the job through the MCP protocol using the `runJob` tool:

```javascript
// Run audit in read-only mode
runJob({
  taskSlug: 'auditPostRelationships',
  input: {
    limit: 50,
    includeUnpublished: false,
    autoFix: false,
  },
})

// Run audit and automatically fix issues
runJob({
  taskSlug: 'auditPostRelationships',
  input: {
    limit: 100,
    includeUnpublished: true,
    autoFix: true, // This will update posts!
  },
})
```

### Via Dashboard Widget (Easiest Method)

1. Log into the Payload Admin
2. On the Dashboard, find the **📊 Post Relationships Health** widget
3. Click either:
   - **Run Audit** - Read-only mode to see issues without making changes
   - **Run & Auto-Fix** - Automatically fix missing relationships
4. View the results immediately with visual breakdown

This widget uses a custom API route (`/api/audit-posts`) that queues and immediately runs the job, returning results without polling.

### Via Payload Admin UI (Jobs Collection)

1. Navigate to **Jobs** in the admin panel
2. Click "Run Job" or "Create Job"
3. Select **Audit Post Relationships**
4. Configure parameters:
   - **Limit**: How many posts to audit (1-500, default: 50)
   - **Include Unpublished**: Check to include drafts
   - **Auto Fix**: Check to automatically update posts
5. Click "Run"

**Note**: This method only queues the job. You need a worker running to process it (via `autoRun` or manually calling `payload.jobs.run()`)

### Programmatically

```typescript
import { auditPostRelationships } from './jobs/auditPostRelationships'

// In your code with PayloadRequest access
const result = await auditPostRelationships(
  50, // limit
  false, // includeUnpublished
  true, // autoFix
  req, // PayloadRequest
)

console.log(`Health Score: ${result.healthScore}%`)
console.log(`Issues found: ${result.totalIssues}`)
```

## Output Structure

The job returns comprehensive results:

```typescript
{
  success: true,
  summary: {
    totalAudited: 47,
    totalIssues: 12,
    healthScore: 74,  // Percentage of posts with complete relationships
    autoFixApplied: true
  },
  breakdown: {
    missingBoth: 3,
    missingCategories: 5,
    missingRelatedPosts: 4,
    complete: 35
  },
  details: {
    missingBoth: [
      { id: "...", slug: "post-1", title: "...", publishedAt: "..." }
    ],
    missingCategories: [...],
    missingRelatedPosts: [...],
    complete: [...]
  }
}
```

## Improving the Suggestion Logic

The current implementation uses simple keyword matching. You can enhance it by:

### 1. Using AI for Category Suggestion

```typescript
// In suggestCategories()
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Given this blog post title: "${post.title}"
Available categories: ${allCategories.map((c) => c.title).join(', ')}

Which 1-2 categories are most appropriate? Return only category titles, comma-separated.`,
      },
    ],
  }),
})
```

### 2. Content Similarity Analysis

```typescript
// Calculate similarity score between posts
function calculateSimilarity(post1: any, post2: any): number {
  // Compare titles, tags, content excerpts, etc.
  // Return score 0-1
}

// Use in suggestRelatedPosts()
const scoredPosts = allPosts
  .map((otherPost) => ({
    post: otherPost,
    score: calculateSimilarity(post, otherPost),
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)
```

### 3. Use Existing Post Data

```typescript
// In suggestCategories()
if (post.meta?.keywords) {
  // Use SEO keywords to match categories
}

if (post.authors) {
  // Suggest categories commonly used by the same authors
}
```

## Scheduling Auto-Audits

Add to [payload.config.ts](/Users/szubrickas/www/mcp-website/src/payload.config.ts#L587-L601):

```typescript
jobs: {
  access: { /* ... */ },
  tasks: [auditPostRelationshipsJob],
  autoRun: [
    {
      cron: '0 2 * * *', // Run daily at 2 AM
      queue: 'default',
      task: 'auditPostRelationships',
      input: {
        limit: 100,
        includeUnpublished: false,
        autoFix: true  // Automatically fix issues
      }
    }
  ]
}
```

## Best Practices

1. **Test First**: Run with `autoFix: false` to see what would change
2. **Start Small**: Use low `limit` values initially (10-20 posts)
3. **Review Results**: Check the `details` output before enabling autoFix
4. **Backup**: Ensure you have database backups before bulk updates
5. **Monitor Logs**: Watch Payload logs during execution for errors
6. **Iterate**: Improve suggestion algorithms based on audit results

## Troubleshooting

### Type Errors

If you see TypeScript errors about `TaskType`, run:

```bash
pnpm run generate:types
```

This generates proper types for your jobs based on the `interfaceName` and `inputSchema`.

### Job Not Appearing

1. Ensure the job is imported and added to `jobs.tasks` array
2. Restart your dev server
3. Check the Payload logs for registration errors

### Auto-Fix Not Working

1. Check user permissions - the job runs with the authenticated user's permissions
2. Verify posts aren't locked by other users
3. Check logs for specific error messages

### No Categories Being Assigned

If the job runs but doesn't assign categories:

1. **Check if categories exist**:
   ```bash
   # The job will log: "Loaded 0 existing categories from Categories collection"
   # This means you need to create categories first!
   ```

2. **Create categories in Payload Admin**:
   - Go to Collections → Categories
   - Click "Create New"
   - Add categories like "Technology", "Tutorial", "News", etc.
   - Save each category

3. **Verify category titles match post content**:
   - If you have a post titled "How to Build React Apps"
   - And a category titled "React"
   - The tool will match them based on keyword "react"
   - Use descriptive category names that might appear in post titles

4. **Check the logs** for matching details:
   ```
   [auditPostRelationships] Suggested 2 existing categories for "My React Tutorial": React, Frontend Development
   ```

## Future Enhancements

- [ ] Add webhook notifications when issues are found
- [ ] Create a dashboard view showing relationship health over time
- [ ] Implement ML-based category suggestions
- [ ] Add batch processing for large sites (>1000 posts)
- [ ] Create relationship validation rules in post hooks
- [ ] Add "suggest only" mode that creates draft updates for review

## Questions?

The implementation follows Payload's Jobs & Queues documentation:

- [Jobs & Queues Docs](https://payloadcms.com/docs/jobs-queue)
- [Task Configuration](https://payloadcms.com/docs/jobs-queue/tasks)
