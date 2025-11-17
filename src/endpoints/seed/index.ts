import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { image3 } from './image-3'
import { imageHero1 } from './image-hero-1'

import { post1 } from './post1'
import { post2 } from './post2'
import { post3 } from './post3'
import { post4 } from './post4'
import { post5 } from './post5'
import { post6 } from './post6'
import { post7 } from './post7'
import { post8 } from './post8'
import { post9 } from './post9'
import { post10 } from './post10'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // clear globals & collections
  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: { navItems: [] },
        depth: 0,
        context: { disableRevalidate: true },
      }),
    ),
  )

  // Only clear collections that actually exist in the current project
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection]))
      .map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter(
        (collection) =>
          Boolean(payload.collections[collection]) &&
          Boolean(payload.collections[collection].config.versions),
      )
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'demo-author@example.com' } },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc, ...categoryDocs] =
    await Promise.all([
      payload.create({
        collection: 'users',
        data: {
          name: 'Demo Author',
          email: 'demo-author@example.com',
          password: 'password',
        },
      }),
      payload.create({
        collection: 'media',
        data: image1,
        file: image1Buffer,
      }),
      payload.create({
        collection: 'media',
        data: image2,
        file: image2Buffer,
      }),
      payload.create({
        collection: 'media',
        data: image3, // ✅ was image2 before—this is now correct
        file: image3Buffer,
      }),
      payload.create({
        collection: 'media',
        data: imageHero1,
        file: hero1Buffer,
      }),
      // ✅ spread the mapped promises so they are awaited by Promise.all
      ...categories.map((category) =>
        payload.create({
          collection: 'categories',
          data: { title: category, slug: category },
        }),
      ),
    ])

  payload.logger.info(`— Seeding posts...`)

  // Build array of post factories (1..10)
  const postBuilders = [post1, post2, post3, post4, post5, post6, post7, post8, post9, post10]

  // Create posts sequentially for deterministic createdAt ordering
  const createdPosts = []
  for (const build of postBuilders) {
    const doc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      // ✅ Reuse the same image for hero + block (as requested)
      data: build({ heroImage: image1Doc, blockImage: image1Doc, author: demoAuthor }),
    })
    createdPosts.push(doc)
  }

  // Keep your original "related posts" triad for the first three
  if (createdPosts.length >= 3) {
    await payload.update({
      id: createdPosts[0].id,
      collection: 'posts',
      data: { relatedPosts: [createdPosts[1].id, createdPosts[2].id] },
    })
    await payload.update({
      id: createdPosts[1].id,
      collection: 'posts',
      data: { relatedPosts: [createdPosts[0].id, createdPosts[2].id] },
    })
    await payload.update({
      id: createdPosts[2].id,
      collection: 'posts',
      data: { relatedPosts: [createdPosts[0].id, createdPosts[1].id] },
    })
  }

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: { type: 'custom', label: 'Posts', url: '/posts' },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: { relationTo: 'pages', value: contactPage.id },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Admin', url: '/admin' } },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, { credentials: 'include', method: 'GET' })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const ext = url.split('.').pop()?.toLowerCase() ?? 'webp'
  const mimetype =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'png'
        ? 'image/png'
        : ext === 'gif'
          ? 'image/gif'
          : 'image/webp'

  return {
    name: url.split('/').pop() || `file-${Date.now()}.${ext}`,
    data: Buffer.from(data),
    mimetype,
    size: data.byteLength,
  }
}
