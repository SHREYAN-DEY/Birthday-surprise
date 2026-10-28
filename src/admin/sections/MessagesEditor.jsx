import RichTextEditor from '../components/RichTextEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'

export default function MessagesEditor() {
  const { data, setSection } = useBirthdayData()
  return (
    <RichTextEditor
      label="Birthday message"
      value={data.mainMessage}
      onChange={(v) => setSection('mainMessage', v)}
      rows={12}
      hint="Shown at the very end behind “Read my birthday message”. You write it, nothing is generated. Use **bold**, *italic* and blank lines."
    />
  )
}
