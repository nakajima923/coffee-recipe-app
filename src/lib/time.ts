export function secondsToMMSS(seconds: number | null | undefined) {
  if (seconds == null) return ""

  const m = Math.floor(seconds / 60)
  const s = seconds % 60

  return `${m}:${String(s).padStart(2, "0")}`
}

export function mmssToSeconds(value: string) {
  if (!value) return 0

  const parts = value.split(":")

  if (parts.length === 1) {
    return Number(parts[0]) || 0
  }

  const minutes = Number(parts[0]) || 0
  const seconds = Number(parts[1]) || 0

  return minutes * 60 + seconds
}