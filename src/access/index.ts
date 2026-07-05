import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrMentor: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'mentor'

export const anyone: Access = () => true

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

/** Read access: everyone sees published docs; admins and mentors also see drafts. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'mentor') return true
  return { _status: { equals: 'published' } }
}

export const hasRole = (user: User | null | undefined, ...roles: User['role'][]) =>
  Boolean(user && roles.includes(user.role))
