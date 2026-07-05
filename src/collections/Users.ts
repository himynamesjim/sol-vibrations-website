import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  access: {
    // Phase 1: accounts are created manually by admins only.
    // Phase 2 adds parent/student accounts via the enrollment workflow.
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Everyone else can only see their own account.
      if (user) return { id: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { id: { equals: user.id } }
      return false
    },
    // Only admins and mentors may log into the admin panel.
    admin: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'mentor',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'mentor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Mentor', value: 'mentor' },
        { label: 'Student', value: 'student' },
        { label: 'Parent', value: 'parent' },
      ],
      access: {
        // Only admins can assign roles — prevents privilege escalation via self-update.
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      saveToJWT: true,
    },
  ],
}
