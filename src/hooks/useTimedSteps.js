import { useEffect, useState } from 'react'

// Moves 0 -> 1 -> 2 ... on its own. `durations` must be a constant array defined outside the component.
export function useTimedSteps(durations, run = true) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!run || step >= durations.length) return
    const t = setTimeout(() => setStep((s) => s + 1), durations[step])
    return () => clearTimeout(t)
  }, [step, run, durations])
  return step
}
