import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}


export const post9: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({ heroImage, blockImage, author }) => {
  return {
    slug: 'agentic-workflows',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'From single prompts to agents: plan-act-observe loops coordinate tools and approvals.', version: 1 }],
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
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'From scripts to loops', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Agents juggle tools, memory, and human-in-the-loop for robust outcomes.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Minimal loop (conceptual)', version: 1 }],
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
              code: 'while (true) {\n  const step = await plan();\n  const out = await act(step);\n  await observe(out);\n  if (done()) break;\n}\n',
              language: 'javascript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Contain and evaluate', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Budgets, guardrails, and eval sets keep agents aligned with policy.', version: 1 }],
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
      description: 'Turn LLM calls into orchestrated workflows.',
      image: heroImage.id,
      title: 'Agentic Workflows',
    },
    relatedPosts: [],
    title: 'Agentic Workflows',
  }
}
