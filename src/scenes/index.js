import LoadingScene from './LoadingScene/LoadingScene.jsx'
import WelcomeScene from './WelcomeScene/WelcomeScene.jsx'
import CharacterScene from './CharacterScene/CharacterScene.jsx'
import QuestionGame from './QuestionGame/QuestionGame.jsx'
import PassedScene from './QuestionGame/PassedScene.jsx'
import FinalQuestionScene from './QuestionGame/FinalQuestionScene.jsx'
import MemoryClouds from './MemoryScene/MemoryClouds.jsx'
import ScrapbookScene from './MemoryScene/ScrapbookScene.jsx'
import ReasonsScene from './ReasonsScene/ReasonsScene.jsx'
import EasterEggScene from './EasterEggScene/EasterEggScene.jsx'
import GardenIntroScene from './SunflowerScene/GardenIntroScene.jsx'
import BouquetScene from './SunflowerScene/BouquetScene.jsx'
import RibbonScene from './SunflowerScene/RibbonScene.jsx'
import FlowerMessagesScene from './SunflowerScene/FlowerMessagesScene.jsx'
import LetterScene from './LetterScene/LetterScene.jsx'
import FinalReveal from './FinalReveal/FinalReveal.jsx'
import SecretScene from './FinalReveal/SecretScene.jsx'
import EndingScene from './EndingScene/EndingScene.jsx'
import { usableMemories, usableReasons, usableQuestions, hasFinalSurprise } from '../utils/selectors.js'

// The whole story, in order. `skip` lets a scene step aside when there is nothing to show.
export const SCENES = [
  { id: 'loading', label: '0 Secret loading', Component: LoadingScene },
  { id: 'welcome', label: '1 Open your surprise', Component: WelcomeScene },
  { id: 'guide', label: '2 Cute guide', Component: CharacterScene },
  { id: 'questions', label: '3-4 Question game', Component: QuestionGame, skip: (d) => !usableQuestions(d).length },
  { id: 'passed', label: '5 You passed', Component: PassedScene },
  { id: 'memoryClouds', label: '6 Memory clouds', Component: MemoryClouds, skip: (d) => !usableMemories(d).length },
  { id: 'scrapbook', label: '7 Scrapbook', Component: ScrapbookScene, skip: (d) => !usableMemories(d).length },
  { id: 'reasons', label: '8 Reasons', Component: ReasonsScene, skip: (d) => !usableReasons(d).length },
  { id: 'easterEggs', label: '9 Easter eggs', Component: EasterEggScene },
  { id: 'garden', label: '10 Sunflower garden', Component: GardenIntroScene },
  { id: 'bouquet', label: '11 Build your bouquet', Component: BouquetScene },
  { id: 'ribbon', label: '12 Ribbon', Component: RibbonScene },
  { id: 'flowerMessages', label: '13 Flower messages', Component: FlowerMessagesScene },
  { id: 'letter', label: '14 Birthday letter', Component: LetterScene },
  { id: 'finalQuestion', label: '15 Final question', Component: FinalQuestionScene },
  { id: 'finalReveal', label: '16 Final reveal', Component: FinalReveal },
  { id: 'secret', label: '17 Secret final surprise', Component: SecretScene, skip: (d) => !hasFinalSurprise(d) },
  { id: 'ending', label: '18 Ending', Component: EndingScene },
]
