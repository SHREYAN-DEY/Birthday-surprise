import SmartImage from './SmartImage.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { displayName } from '../../utils/text.js'

// Her profile picture, shown only where you ticked the box in /setup
export default function ProfileBadge({ where, className = 'h-20 w-20' }) {
  const { data } = useBirthdayData()
  const her = data.her
  if (!her.profileImage || !her.profileUsage?.[where]) return null
  return (
    <SmartImage
      src={her.profileImage}
      alt={`Photo of ${displayName(data)}`}
      className={`${className} rounded-full border-4 border-white object-cover shadow-md`}
      fallback={null}
    />
  )
}
