import { noMessages } from './defaultMessages.js'

const q = (id, question, yesText, noText, successMessage) => ({
  id, question, yesText, noText, successMessage, noMessages,
})

export const defaultQuestions = [
  q('q0', 'Do you know how special you are?', 'YES ❤️', 'NO 🙈', 'Good. Keep knowing that.'),
  q('q1', 'Do you know how cute you are?', 'YES ❤️', 'NO 🙈', 'Correct answer.'),
  q('q2', 'Do you agree that you deserve an amazing birthday?', 'YES 🎂', 'NO 😐', 'Exactly. Amazing it is.'),
  q('q3', 'Will you accept a virtual sunflower bouquet?', 'YES 🌻', 'NO', 'Great, because it is already on its way.'),
  q('q4', 'Who has better taste?', 'You 😌', 'Obviously me 😎', 'I knew you would say that.'),
  q('q5', 'Are you ready for your memories?', 'YES 📸', 'NO', 'Okay. Deep breath.'),
  q('q6', 'Can I make one birthday wish for you?', 'YES ❤️', 'NO', 'Done. I will not tell you what it was.'),
  q('q7', 'Are you ready for the last surprise?', 'YES', 'NO', 'Here we go.'),
]
