import type { PayloadRequest } from 'payload'

type AuditResult = {
  missingBoth: Array<{
    id: string
    slug: string
    title: string
    publishedAt?: string
  }>
  missingCategories: Array<{
    id: string
    slug: string
    title: string
    publishedAt?: string
    relatedPostsCount: number
  }>
  missingRelatedPosts: Array<{
    id: string
    slug: string
    title: string
    publishedAt?: string
    categoriesCount: number
  }>
  complete: Array<{
    id: string
    slug: string
    title: string
    categoriesCount: number
    relatedPostsCount: number
  }>
}

/**
 * Helper function to analyze post content and suggest categories FROM EXISTING CATEGORIES ONLY
 * This function DOES NOT create new categories - it only matches against existing ones
 *
 * Algorithm:
 * 1. Checks if category title/slug appears in post title
 * 2. Checks if category title appears in post slug
 * 3. Uses a scoring system to rank matches
 * 4. Returns top 2 best matches
 *
 * @param post - The post to analyze
 * @param allCategories - Existing categories from the Categories collection
 * @param req - PayloadRequest for logging
 * @returns Array of category IDs (max 2) from existing categories
 */
async function suggestCategories(
  post: any,
  allCategories: any[],
  req: PayloadRequest,
): Promise<string[]> {
  const { payload } = req

  if (!post.title || allCategories.length === 0) {
    payload.logger.warn(
      `[auditPostRelationships] Cannot suggest categories for "${post.title}" - no title or no categories available`,
    )
    return []
  }

  const titleLower = post.title.toLowerCase()
  const slugLower = post.slug?.toLowerCase() || ''

  // Score each category based on relevance
  const scoredCategories = allCategories.map((category) => {
    let score = 0
    const categoryTitle = (category.title?.toLowerCase() || '').trim()
    const categorySlug = (category.slug?.toLowerCase() || '').trim()

    if (!categoryTitle) return { category, score: 0 }

    // Exact match in title (highest score)
    if (titleLower.includes(categoryTitle)) {
      score += 10
    }

    // Exact match in slug
    if (slugLower.includes(categorySlug)) {
      score += 8
    }

    // Check for word matches (partial scoring)
    const titleWords = titleLower.split(/\s+/)
    const categoryWords = categoryTitle.split(/\s+/)

    for (const catWord of categoryWords) {
      if (catWord.length > 3 && titleWords.some(word => word.includes(catWord))) {
        score += 3
      }
    }

    return { category, score }
  })

  // Sort by score and get top matches
  const topMatches = scoredCategories
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2) // Max 2 categories per post
    .map(({ category }) => category.id)

  // If no matches found, suggest the most commonly used category as fallback
  if (topMatches.length === 0 && allCategories.length > 0) {
    // Default to first category (could be enhanced to track usage stats)
    topMatches.push(allCategories[0].id)
    payload.logger.info(
      `[auditPostRelationships] No keyword matches for "${post.title}", using fallback category: ${allCategories[0].title}`,
    )
  }

  if (topMatches.length > 0) {
    const matchedCategories = allCategories
      .filter(c => topMatches.includes(c.id))
      .map(c => c.title)
      .join(', ')

    payload.logger.info(
      `[auditPostRelationships] Suggested ${topMatches.length} existing categories for "${post.title}": ${matchedCategories}`,
    )
  }

  return topMatches
}

/**
 * Helper function to find related posts based on categories and content similarity
 */
async function suggestRelatedPosts(
  post: any,
  allPosts: any[],
  req: PayloadRequest,
): Promise<string[]> {
  const { payload } = req

  if (!post.id) return []

  const suggestions: string[] = []
  const postCategories = Array.isArray(post.categories)
    ? post.categories.map((cat) => (typeof cat === 'string' ? cat : cat.id))
    : []

  // Find posts with overlapping categories
  for (const otherPost of allPosts) {
    // Skip self
    if (otherPost.id === post.id) continue

    // Skip if already at max suggestions
    if (suggestions.length >= 3) break

    const otherCategories = Array.isArray(otherPost.categories)
      ? otherPost.categories.map((cat) => (typeof cat === 'string' ? cat : cat.id))
      : []

    // Check for category overlap
    const hasOverlap = postCategories.some((catId) => otherCategories.includes(catId))

    if (hasOverlap && otherPost.id) {
      suggestions.push(otherPost.id)
    }
  }

  // If still need more suggestions, add recent posts
  if (suggestions.length < 2) {
    for (const otherPost of allPosts) {
      if (otherPost.id === post.id) continue
      if (suggestions.includes(otherPost.id)) continue
      if (suggestions.length >= 3) break

      if (otherPost.id) {
        suggestions.push(otherPost.id)
      }
    }
  }

  payload.logger.info(
    `[auditPostRelationships] Suggested ${suggestions.length} related posts for: ${post.title}`,
  )

  return suggestions
}

/**
 * Audit and optionally fix post relationships
 */
export const auditPostRelationships = async (
  limit = 50,
  includeUnpublished = false,
  autoFix = false,
  req: PayloadRequest,
): Promise<AuditResult> => {
  const { payload } = req

  payload.logger.info('[auditPostRelationships] Starting audit...')

  // Fetch all posts
  const whereClause = includeUnpublished ? {} : { _status: { equals: 'published' } }

  const postsResult = await payload.find({
    collection: 'posts',
    limit,
    where: whereClause,
    depth: 2, // Populate relationships
  })

  payload.logger.info(`[auditPostRelationships] Found ${postsResult.docs.length} posts to audit`)

  // Fetch ALL existing categories from the Categories collection for suggestions
  // IMPORTANT: This DOES NOT create new categories - it only uses existing ones
  let allCategories: any[] = []
  if (autoFix) {
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 1000, // Increased to ensure we get all categories
      depth: 0,
    })
    allCategories = categoriesResult.docs
    payload.logger.info(
      `[auditPostRelationships] Loaded ${allCategories.length} existing categories from Categories collection: ${allCategories.map(c => c.title).join(', ')}`,
    )

    if (allCategories.length === 0) {
      payload.logger.error(
        '[auditPostRelationships] ⚠️  WARNING: No categories found in Categories collection! Auto-fix will not be able to assign categories. Please create categories first.',
      )
      // Continue anyway to still report issues and fix related posts
    }
  }

  const result: AuditResult = {
    missingBoth: [],
    missingCategories: [],
    missingRelatedPosts: [],
    complete: [],
  }

  // First pass: Analyze and categorize all posts based on their INITIAL state
  // This must be done BEFORE any updates to ensure accurate reporting
  type PostAnalysis = {
    post: any
    category: 'missingBoth' | 'missingCategories' | 'missingRelatedPosts' | 'complete'
    hasCategories: boolean
    hasRelatedPosts: boolean
    categoriesCount: number
    relatedPostsCount: number
  }

  const postsAnalysis: PostAnalysis[] = []

  for (const post of postsResult.docs) {
    const rawCategories = Array.isArray(post.categories) ? post.categories : []
    const rawRelatedPosts = Array.isArray(post.relatedPosts) ? post.relatedPosts : []

    // Filter out null, undefined, empty string values
    const categories = rawCategories.filter((cat) => cat != null && cat !== '')
    const relatedPosts = rawRelatedPosts.filter((rel) => rel != null && rel !== '')

    // DEBUG: Log what we're seeing for each post
    payload.logger.info(
      `[DEBUG] Post "${post.title}": raw categories=${JSON.stringify(post.categories)}, raw relatedPosts=${JSON.stringify(post.relatedPosts)}`,
    )
    payload.logger.info(
      `[DEBUG] After filtering: categories.length=${categories.length}, relatedPosts.length=${relatedPosts.length}`,
    )

    const hasCategories = categories.length > 0
    const hasRelatedPosts = relatedPosts.length > 0

    const postSummary = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt || undefined,
    }

    let category: 'missingBoth' | 'missingCategories' | 'missingRelatedPosts' | 'complete'

    if (!hasCategories && !hasRelatedPosts) {
      result.missingBoth.push(postSummary)
      category = 'missingBoth'
    } else if (!hasCategories) {
      result.missingCategories.push({
        ...postSummary,
        relatedPostsCount: relatedPosts.length,
      })
      category = 'missingCategories'
    } else if (!hasRelatedPosts) {
      result.missingRelatedPosts.push({
        ...postSummary,
        categoriesCount: categories.length,
      })
      category = 'missingRelatedPosts'
    } else {
      result.complete.push({
        ...postSummary,
        categoriesCount: categories.length,
        relatedPostsCount: relatedPosts.length,
      })
      category = 'complete'
    }

    postsAnalysis.push({
      post,
      category,
      hasCategories,
      hasRelatedPosts,
      categoriesCount: categories.length,
      relatedPostsCount: relatedPosts.length,
    })
  }

  // Second pass: Apply fixes if autoFix is enabled
  if (autoFix) {
    payload.logger.info('[auditPostRelationships] Applying auto-fixes...')

    for (const analysis of postsAnalysis) {
      const { post, category } = analysis

      if (category === 'missingBoth') {
        // Suggest and apply fixes for both categories and related posts
        const suggestedCategories = await suggestCategories(post, allCategories, req)
        const suggestedRelatedPosts = await suggestRelatedPosts(post, postsResult.docs, req)

        try {
          await payload.update({
            collection: 'posts',
            id: post.id,
            data: {
              categories: suggestedCategories,
              relatedPosts: suggestedRelatedPosts,
            },
            req,
          })

          payload.logger.info(
            `[auditPostRelationships] ✅ Fixed post: ${post.title} (${suggestedCategories.length} categories, ${suggestedRelatedPosts.length} related posts)`,
          )
        } catch (error) {
          payload.logger.error(
            `[auditPostRelationships] ❌ Failed to fix post ${post.title}: ${error}`,
          )
        }
      } else if (category === 'missingCategories') {
        // Only fix categories
        const suggestedCategories = await suggestCategories(post, allCategories, req)

        try {
          await payload.update({
            collection: 'posts',
            id: post.id,
            data: {
              categories: suggestedCategories,
            },
            req,
          })

          payload.logger.info(
            `[auditPostRelationships] ✅ Added categories to post: ${post.title} (${suggestedCategories.length} categories)`,
          )
        } catch (error) {
          payload.logger.error(
            `[auditPostRelationships] ❌ Failed to add categories to ${post.title}: ${error}`,
          )
        }
      } else if (category === 'missingRelatedPosts') {
        // Only fix related posts
        const suggestedRelatedPosts = await suggestRelatedPosts(post, postsResult.docs, req)

        try {
          await payload.update({
            collection: 'posts',
            id: post.id,
            data: {
              relatedPosts: suggestedRelatedPosts,
            },
            req,
          })

          payload.logger.info(
            `[auditPostRelationships] ✅ Added related posts to: ${post.title} (${suggestedRelatedPosts.length} related posts)`,
          )
        } catch (error) {
          payload.logger.error(
            `[auditPostRelationships] ❌ Failed to add related posts to ${post.title}: ${error}`,
          )
        }
      }
      // 'complete' category needs no fixes
    }
  }

  payload.logger.info(
    `[auditPostRelationships] Audit complete! Missing both: ${result.missingBoth.length}, Missing categories: ${result.missingCategories.length}, Missing related posts: ${result.missingRelatedPosts.length}, Complete: ${result.complete.length}`,
  )

  return result
}
