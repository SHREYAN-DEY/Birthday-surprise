import ListEditor from '../components/ListEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { newId } from '../../utils/id.js'

const fields = [
  { key: 'question', label: 'Question', type: 'textarea', max: 500, rows: 2 },
  { key: 'yesText', label: 'YES text', max: 60 },
  { key: 'noText', label: 'NO text', max: 60 },
  { key: 'successMessage', label: 'Success message', max: 200 },
  { key: 'noMessages', label: 'What the NO button says when she tries it (one per line)', type: 'lines', hint: 'Leave empty to use the defaults like “Nice try.”' },
]
const makeItem = () => ({ id: newId(), question: '', yesText: 'YES ❤️', noText: 'NO 🙈', successMessage: '', noMessages: [] })

export default function QuestionsManager() {
  const { data, setSection } = useBirthdayData()
  return (
    <ListEditor items={data.questions} onChange={(v) => setSection('questions', v)} fields={fields} makeItem={makeItem}
      titleOf={(q) => q.question} addLabel="Add a question" max={50}
      emptyText="No questions. The question game is skipped when this list is empty." />
  )
}
