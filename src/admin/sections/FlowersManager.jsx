import ListEditor from '../components/ListEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { newId } from '../../utils/id.js'

const fields = [
  { key: 'message', label: 'Message', type: 'textarea', max: 1000, rows: 2 },
  { key: 'image', label: 'Picture (optional)', type: 'image' },
]

export default function FlowersManager() {
  const { data, setSection } = useBirthdayData()
  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-600">
        The first 7 become the sunflowers she picks for the bouquet. Any extras are used by “Pick one more flower”.
      </p>
      <ListEditor items={data.flowers} onChange={(v) => setSection('flowers', v)} fields={fields}
        makeItem={() => ({ id: newId(), message: '', image: '' })} titleOf={(f) => f.message} addLabel="Add a flower message" max={200}
        emptyText="No flower messages yet." />
    </div>
  )
}
