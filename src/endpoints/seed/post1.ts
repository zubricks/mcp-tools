import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}


export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({ heroImage, blockImage, author }) => {
  return {
    slug: 'edge-computing-rush',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Compute moves to the edge, shrinking latency and unlocking new realtime experiences for users and devices.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Disclaimer',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        { type: 'text', detail: 0, format: 1, mode: 'normal', style: '', text: 'Disclaimer:', version: 1 },
                        { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: ' This content is fabricated and for demonstration purposes only. To edit this post, ', version: 1 },
                        {
                          type: 'link',
                          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'navigate to the admin dashboard', version: 1 }],
                          direction: 'ltr',
                          fields: { linkType: 'custom', newTab: true, url: '/admin' },
                          format: '',
                          indent: 0,
                          version: 3,
                        },
                        { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: '.', version: 1 },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Why Edge Now?', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'AR overlays, robotics, multiplayer, and IoT analytics all benefit when compute happens near the user instead of a distant region.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Simple edge request example', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h4',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Generate Text',
              blockType: 'code',
              code: "async function pingEdge() {\n  const res = await fetch('/api/edge/ping', { method: 'POST' });\n  console.log(await res.text());\n}\npingEdge();\n",
              language: 'javascript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Operational Constraints', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Bandwidth, intermittent links, and secure rollouts shape how edge apps are built and shipped in production.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Dynamic Components',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.", version: 1 }],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description: 'Compute at the edge enables realtime experiences and smarter devices.',
      image: heroImage.id,
      title: 'Edge Computing Rush',
    },
    relatedPosts: [],
    title: 'Edge Computing Rush',
  }
}
