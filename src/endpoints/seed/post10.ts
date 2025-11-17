import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}


export const post10: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({ heroImage, blockImage, author }) => {
  return {
    slug: 'design-systems-gen-design',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Generative tooling drafts variants; tokens and reviews keep results on-brand and accessible.', version: 1 }],
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
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Brief → variants', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Use automated drafts to explore; teams critique, constrain, and converge.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Tokenized prompt (example)', version: 1 }],
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
              code: "const prompt = { brand: 'modern', spacing: '8px', a11y: 'AA' };\nconsole.log(prompt);\n",
              language: 'javascript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Guardrails & tokens', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Linting and token checks keep outputs consistent across surfaces.', version: 1 }],
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
      description: 'Generative design guided by tokens and reviews.',
      image: heroImage.id,
      title: 'Design Systems & Gen Design',
    },
    relatedPosts: [],
    title: 'Design Systems & Gen Design',
  }
}
