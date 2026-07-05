export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="bg-sol-deep text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{intro}</p>}
      </div>
    </section>
  )
}
