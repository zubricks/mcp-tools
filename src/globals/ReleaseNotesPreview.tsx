import type { GlobalConfig } from 'payload'

export const ReleaseNotesPreview: GlobalConfig = {
  slug: 'releaseNotesPreview',
  access: {
    read: () => true, // allow viewing in Admin
    update: () => true, // allow updates by the MCP tool
  },
  fields: [
    {
      name: 'latestText',
      type: 'textarea',
      admin: { readOnly: true },
      label: 'Latest Release Notes',
    },
    {
      name: 'limit',
      type: 'number',
      admin: { readOnly: true },
      label: 'Limit Used',
    },
    {
      name: 'generatedAt',
      type: 'date',
      admin: { readOnly: true },
      label: 'Generated At',
    },
  ],
  label: 'Release Notes Preview',
}
