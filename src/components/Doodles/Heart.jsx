export default function Heart({ className = 'w-6 h-6 text-heart', title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M12 21s-7-4.5-9.5-9C.5 8 2.5 4 6.5 4c2 0 3.7 1.1 5.5 3 1.8-1.9 3.5-3 5.5-3 4 0 6 4 4 8-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  )
}
