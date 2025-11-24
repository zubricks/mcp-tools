import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '@/access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdmin,
    delete: isAdminOrSelf,
    read: () => true,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: ['public'],
      hasMany: true,
      options: ['admin', 'public'],
      required: true,
    },
    {
      name: 'apiKeyDisplay',
      type: 'ui',
      admin: {
        components: {
          Field: '@/collections/Users/components/UserApiKeyField#UserApiKeyField',
        },
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
