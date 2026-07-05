import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import type { Page } from '@/payload-types'

type LayoutBlocks = NonNullable<Page['layout']>

export function RenderBlocks({ blocks }: { blocks: LayoutBlocks }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <section key={block.id} className="bg-sol-deep text-white">
                <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
                  <h1 className="max-w-2xl text-4xl leading-tight sm:text-5xl">{block.heading}</h1>
                  {block.subheading && (
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                      {block.subheading}
                    </p>
                  )}
                  {block.ctas && block.ctas.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      {block.ctas.map((cta) => (
                        <Link
                          key={cta.id}
                          href={cta.url}
                          className={cta.style === 'secondary' ? 'btn-secondary' : 'btn-primary'}
                        >
                          {cta.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )

          case 'richText':
            return (
              <section key={block.id} className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <RichText data={block.content} />
              </section>
            )

          case 'imageText':
            return (
              <section key={block.id} className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div
                  className={`grid items-center gap-8 md:grid-cols-2 ${
                    block.imagePosition === 'left' ? '' : 'md:[&>*:first-child]:order-2'
                  }`}
                >
                  <div>
                    {block.image && typeof block.image !== 'number' && (
                      <MediaImage
                        media={block.image}
                        size="card"
                        className="w-full rounded-2xl"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    )}
                  </div>
                  <div>
                    {block.heading && <h2 className="mb-4 text-3xl text-sol-deep">{block.heading}</h2>}
                    <RichText data={block.content} />
                  </div>
                </div>
              </section>
            )

          case 'ctaBanner':
            return (
              <section key={block.id} className="bg-gradient-to-r from-sol-violet to-sol-gold">
                <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
                  <h2 className="text-3xl text-white drop-shadow-sm">{block.heading}</h2>
                  {block.text && <p className="mx-auto mt-3 max-w-xl text-lg text-white/95">{block.text}</p>}
                  {block.cta?.url && block.cta?.label && (
                    <Link href={block.cta.url} className="btn mt-6 bg-sol-deep text-white hover:bg-sol-ink">
                      {block.cta.label}
                    </Link>
                  )}
                </div>
              </section>
            )

          case 'stats':
            return (
              <section key={block.id} className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                {block.heading && <h2 className="mb-8 text-3xl text-sol-deep">{block.heading}</h2>}
                <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {block.items?.map((item) => (
                    <div key={item.id} className="card p-6 text-center">
                      <dd className="font-display text-4xl font-bold text-sol-violet-strong">
                        {item.value}
                      </dd>
                      <dt className="mt-1 text-sm font-semibold text-sol-ink/70">{item.label}</dt>
                    </div>
                  ))}
                </dl>
              </section>
            )

          case 'faq':
            return (
              <section key={block.id} className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                {block.heading && <h2 className="mb-6 text-3xl text-sol-deep">{block.heading}</h2>}
                <div className="space-y-3">
                  {block.items?.map((item) => (
                    <details key={item.id} className="card group p-0">
                      <summary className="cursor-pointer list-none px-6 py-4 font-display font-bold text-sol-deep [&::-webkit-details-marker]:hidden">
                        <span className="mr-2 inline-block text-sol-violet transition-transform group-open:rotate-90">
                          ▸
                        </span>
                        {item.question}
                      </summary>
                      <div className="px-6 pb-5">
                        <RichText data={item.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
