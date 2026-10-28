import { useContext } from 'react'
import { BirthdayContext } from '../context/BirthdayContext.jsx'

export function useBirthdayData() {
  const ctx = useContext(BirthdayContext)
  if (!ctx) throw new Error('useBirthdayData must be used inside <BirthdayProvider>')
  return ctx
}
