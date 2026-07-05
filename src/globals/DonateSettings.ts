import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'
import { revalidateGlobalPaths } from '@/hooks/revalidate'

export const DonateSettings: GlobalConfig = {
  slug: 'donate-settings',
  label: 'Donate Page',
  admin: { group: 'Admin' },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateGlobalPaths('/donate', '/')],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Help us put instruments in kids’ hands',
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Why donations matter — what a gift funds, impact examples, etc.',
      },
    },
    {
      name: 'givingLinks',
      type: 'array',
      label: 'External giving links',
      minRows: 1,
      admin: {
        description:
          'Links to external giving platforms (e.g. PayPal Giving Fund, GoFundMe Charity). No payments are processed on this site.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'description',
          type: 'text',
          admin: { description: 'Optional: one line about this giving option.' },
        },
      ],
    },
  ],
}
