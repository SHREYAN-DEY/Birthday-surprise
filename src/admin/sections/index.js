import GeneralSettings from './GeneralSettings.jsx'
import HerDetails from './HerDetails.jsx'
import MyDetails from './MyDetails.jsx'
import MemoriesManager from './MemoriesManager.jsx'
import MessagesEditor from './MessagesEditor.jsx'
import FinalLetterEditor from './FinalLetterEditor.jsx'
import QuestionsManager from './QuestionsManager.jsx'
import ReasonsManager from './ReasonsManager.jsx'
import FlowersManager from './FlowersManager.jsx'
import SecretsManager from './SecretsManager.jsx'
import MusicManager from './MusicManager.jsx'
import ThemeManager from './ThemeManager.jsx'
import ImportantDatesManager from './ImportantDatesManager.jsx'
import SettingsSection from './SettingsSection.jsx'

// previewScene = which scene the live preview jumps to while you edit that section
export const SECTIONS = [
  { id: 'general', icon: '🎂', label: 'General', Component: GeneralSettings, previewScene: 'finalReveal' },
  { id: 'her', icon: '👩', label: 'Her details', Component: HerDetails, previewScene: 'welcome' },
  { id: 'me', icon: '❤️', label: 'My details', Component: MyDetails, previewScene: 'letter' },
  { id: 'memories', icon: '📸', label: 'Memories', Component: MemoriesManager, previewScene: 'scrapbook' },
  { id: 'messages', icon: '💌', label: 'Messages', Component: MessagesEditor, previewScene: 'ending' },
  { id: 'letter', icon: '✉️', label: 'Birthday letter', Component: FinalLetterEditor, previewScene: 'letter' },
  { id: 'questions', icon: '❓', label: 'Questions', Component: QuestionsManager, previewScene: 'questions' },
  { id: 'reasons', icon: '🧡', label: 'Reasons', Component: ReasonsManager, previewScene: 'reasons' },
  { id: 'flowers', icon: '🌻', label: 'Sunflowers', Component: FlowersManager, previewScene: 'bouquet' },
  { id: 'secrets', icon: '🎁', label: 'Secrets', Component: SecretsManager, previewScene: 'easterEggs' },
  { id: 'music', icon: '🎵', label: 'Music', Component: MusicManager, previewScene: 'welcome' },
  { id: 'theme', icon: '🎨', label: 'Theme', Component: ThemeManager, previewScene: 'garden' },
  { id: 'dates', icon: '📅', label: 'Important dates', Component: ImportantDatesManager, previewScene: 'scrapbook' },
  { id: 'settings', icon: '⚙️', label: 'Settings', Component: SettingsSection, previewScene: null },
]
