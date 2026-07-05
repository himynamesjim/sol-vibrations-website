'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavLink = { label: string; url: string }

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the menu whenever navigation happens.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-white hover:bg-white/10"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main navigation"
          className="absolute inset-x-0 top-full border-t border-white/10 bg-sol-deep pb-6 shadow-xl"
        >
          <ul className="mx-auto max-w-6xl px-4 pt-2 sm:px-6">
            {links.map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  className="block rounded-xl px-4 py-3 font-display text-lg font-semibold text-white/90 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
