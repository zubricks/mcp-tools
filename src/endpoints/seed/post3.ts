import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}


export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({ heroImage, blockImage, author }) => {
  return {
    slug: 'semantic-search-rag',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Semantic search retrieves by meaning, enabling RAG systems to ground answers in your data.', version: 1 }],
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
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Vectors + Hybrids', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Combine lexical and vector search for relevance that balances precision with recall.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Query flow (conceptual)', version: 1 }],
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
              code: "async function search(q){\n  const embed = await fetch('/api/embed',{method:'POST',body:JSON.stringify({text:q})});\n  const results = await fetch('/api/search',{method:'POST',body:await embed.text()});\n  return results.json();\n}\n",
              language: 'javascript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Freshness matters', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Blend signals like recency and authority to reduce hallucinations and stale answers.', version: 1 }],
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
      description: 'Semantic search and RAG for grounded answers.',
      image: heroImage.id,
      title: 'Semantic Search & RAG',
    },
    relatedPosts: [],
    title: 'Semantic Search & RAG',
  }
}
