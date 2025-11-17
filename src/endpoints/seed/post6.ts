import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}


export const post6: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({ heroImage, blockImage, author }) => {
  return {
    slug: 'ar-vr-collaboration',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'AR/VR brings presence to remote work—feel “there” for reviews, planning, and training.', version: 1 }],
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
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Presence over pixels', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Low motion-to-photon latency and natural input drive adoption more than pure resolution.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Check for WebXR', version: 1 }],
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
              code: "if (navigator.xr) { console.log('WebXR available'); }\n",
              language: 'javascript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Use cases', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Design reviews, remote assist, and 3D-first workflows benefit most from XR.', version: 1 }],
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
      description: 'AR/VR collaboration aims for presence and low latency.',
      image: heroImage.id,
      title: 'AR/VR Collaboration',
    },
    relatedPosts: [],
    title: 'AR/VR Collaboration',
  }
}
