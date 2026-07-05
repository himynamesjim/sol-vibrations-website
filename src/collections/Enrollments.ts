import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrMentor } from '@/access'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'studentFirstName',
    defaultColumns: ['studentFirstName', 'parentName', 'program', 'status', 'createdAt'],
    group: 'Admin',
    description: 'Interest submissions from the public enrollment form. Triage via the Status column.',
  },
  access: {
    // The public form creates these; nobody outside staff can read them back.
    create: () => true,
    read: isAdminOrMentor,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'parentName', type: 'text', required: true, label: 'Parent/guardian name' },
        { name: 'parentEmail', type: 'email', required: true, label: 'Parent/guardian email' },
      ],
    },
    { name: 'parentPhone', type: 'text', required: true, label: 'Parent/guardian phone' },
    {
      type: 'row',
      fields: [
        { name: 'studentFirstName', type: 'text', required: true, label: 'Student first name' },
        {
          name: 'studentAge',
          type: 'number',
          required: true,
          min: 3,
          max: 21,
          label: 'Student age',
        },
      ],
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      required: true,
      label: 'Program interest',
    },
    {
      name: 'instrument',
      type: 'select',
      options: [
        { label: 'Guitar', value: 'guitar' },
        { label: 'Ukulele', value: 'ukulele' },
        { label: 'Not sure yet', value: 'undecided' },
      ],
      label: 'Preferred instrument',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priorLessons',
          type: 'select',
          label: 'Taken music lessons before?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
        },
        {
          name: 'playedGuitarBefore',
          type: 'select',
          label: 'Played guitar before?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ownsInstrument',
          type: 'select',
          label: 'Owns a stringed instrument?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
        },
        {
          name: 'ownedInstrument',
          type: 'select',
          label: 'Which instrument?',
          options: [
            { label: 'Guitar', value: 'guitar' },
            { label: 'Ukulele', value: 'ukulele' },
            { label: 'Bass', value: 'bass' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            condition: (data) => data?.ownsInstrument === 'yes',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Anything we should know',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Waitlist', value: 'waitlist' },
        { label: 'Closed', value: 'closed' },
      ],
      access: {
        // The public form may not set status — it always starts as pending.
        create: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: { position: 'sidebar' },
    },
  ],
}
