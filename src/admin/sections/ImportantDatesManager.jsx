import ListEditor from '../components/ListEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { newId } from '../../utils/id.js'

const fields = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'title', label: 'Title', max: 150, placeholder: 'First conversation' },
  { key: 'description', label: 'Description', type: 'textarea', max: 1000, rows: 2 },
  { key: 'photo', label: 'Photo (optional)', type: 'image' },
]

export default function ImportantDatesManager() {
  const { data, setSection } = useBirthdayData()
  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-600">These become the little timeline under the scrapbook. They show sorted by date.</p>
      <ListEditor items={data.importantDates} onChange={(v) => setSection('importantDates', v)} fields={fields}
        makeItem={() => ({ id: newId(), date: '', title: '', description: '', photo: '' })}
        titleOf={(d) => `${d.date} ${d.title}`} addLabel="Add a date" max={100} />
    </div>
  )
}
