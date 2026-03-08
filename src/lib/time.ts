export function secondsToMMSS(seconds: number | null | undefined) {
  if (seconds == null || Number.isNaN(seconds)) return ""

  const m = Math.floor(seconds / 60)
  const s = seconds % 60

  return `${m}:${String(s).padStart(2, "0")}`
}

export function isValidMMSS(value: string) {
  return /^\d+:\d{2}$/.test(value)
}

export function mmssToSeconds(value: string) {
  if (!isValidMMSS(value)) return null

  const [minutesText, secondsText] = value.split(":")
  const minutes = Number(minutesText)
  const seconds = Number(secondsText)

  if (
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    seconds < 0 ||
    seconds >= 60
  ) {
    return null
  }

  return minutes * 60 + seconds
}