import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'
import { revalidateGlobalPaths } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Admin' },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateGlobalPaths('/')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'Sol Vibrations' },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Our sound is light, our light is sound.',
            },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'nonprofitBlurb',
              type: 'textarea',
              label: '501(c)(3) blurb',
              defaultValue:
                'Sol Vibrations is a 501(c)(3) nonprofit organization. Donations are tax-deductible to the extent allowed by law.',
            },
            {
              name: 'ein',
              type: 'text',
              label: 'EIN',
              defaultValue: 'XX-XXXXXXX',
              admin: { description: 'Employer Identification Number, shown in the footer.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email', defaultValue: 'hello@solvibrations.net' },
            { name: 'phone', type: 'text' },
            {
              name: 'address',
              type: 'textarea',
              admin: { description: 'Mailing address, shown on the contact page and footer.' },
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navLinks',
              type: 'array',
              label: 'Header navigation',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'footerLinks',
              type: 'array',
              label: 'Footer navigation',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'X / Twitter', value: 'x' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
