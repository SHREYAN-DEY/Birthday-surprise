// Left rail on desktop, scrollable chips on phones
export default function AdminSidebar({ sections, active, onSelect }) {
  return (
    <nav aria-label="Setup sections" className="lg:sticky lg:top-4 lg:self-start">
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <button
              type="button" onClick={() => onSelect(s.id)} aria-current={active === s.id ? 'page' : undefined}
              className={`flex min-h-11 w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 text-left font-bold lg:rounded-lg ${active === s.id ? 'border-heart bg-heart text-white' : 'border-sky-mid bg-white text-stone-800 hover:bg-sky-soft'}`}
            >
              <span aria-hidden="true">{s.icon}</span>{s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
