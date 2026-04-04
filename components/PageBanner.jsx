export default function PageBanner({ imageUrl, badge, badgeIcon, title, description, minHeight = 340 }) {
  return (
    <section
      className="relative bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('${imageUrl}')`, minHeight: `${minHeight}px` }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(10, 22, 40, 0.70)' }}
      />
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center"
        style={{ minHeight: `${minHeight}px` }}
      >
        <h1 className="text-4xl md:text-5xl mb-4 text-white font-medium">{title}</h1>
        <p className="text-xl text-white/85 max-w-3xl mx-auto">{description}</p>
      </div>
    </section>
  )
}
