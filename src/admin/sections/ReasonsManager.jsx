import ListEditor from '../components/ListEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { newId } from '../../utils/id.js'

const fields = [
  { key: 'text', label: 'Reason', type: 'textarea', max: 1000, rows: 2 },
  { key: 'image', label: 'Picture (optional)', type: 'image' },
]

export default function ReasonsManager() {
  const { data, setSection } = useBirthdayData()
  return (
    <ListEditor items={data.reasons} onChange={(v) => setSection('reasons', v)} fields={fields}
      makeItem={() => ({ id: newId(), text: '', image: '' })} titleOf={(r) => r.text} addLabel="Add a reason" max={200}
      emptyText="No reasons yet. The reasons scene is skipped when this is empty." />
  )
}
