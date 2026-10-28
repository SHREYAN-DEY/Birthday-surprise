// **bold**, *italic* and line breaks, rendered as React elements.
// No HTML is ever injected, so there is nothing for a script to hide in.
function inline(line) {
  const out = []
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g
  let last = 0
  let k = 0
  let m
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index))
    out.push(m[2] !== undefined ? <strong key={k++}>{m[2]}</strong> : <em key={k++}>{m[3]}</em>)
    last = m.index + m[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

export default function RichText({ text = '', className = '' }) {
  const lines = String(text).split('\n')
  return (
    <div className={`break-words ${className}`}>
      {lines.map((l, i) => (
        <span key={i}>
          {inline(l)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </div>
  )
}
