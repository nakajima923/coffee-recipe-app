"use client"

import { useEffect, useRef, useState } from "react"
import { isValidMMSS, mmssToSeconds, secondsToMMSS } from "@/lib/time"
import { parseFlexibleTime } from "@/lib/time"

type Props = {
  value: number
  onChange: (seconds: number) => void
  disabled?: boolean
}

export function TimeInput({ value, onChange, disabled = false }: Props) {
  const [text, setText] = useState(secondsToMMSS(value))
  const [hasError, setHasError] = useState(false)
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (!isFocusedRef.current) {
      setText(secondsToMMSS(value))
      setHasError(false)
    }
  }, [value])

  function handleChange(v: string) {
    const sanitized = v.replace(/[^\d:]/g, "")
    setText(sanitized)
    setHasError(false)
  }

  function handleFocus() {
    isFocusedRef.current = true
  }

  function handleBlur() {
    isFocusedRef.current = false


    const seconds = parseFlexibleTime(text)

    if (seconds == null) {
      setText(secondsToMMSS(value))
      setHasError(true)
      return
    }

    onChange(seconds)
    setText(secondsToMMSS(seconds))
    setHasError(false)
  }

  return (
    <div className="space-y-1">
      <input
        type="text"
        inputMode="numeric"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="1:30"
        disabled={disabled}
        className={`w-full rounded-xl border bg-white px-3 py-2 outline-none transition disabled:bg-stone-100 disabled:text-stone-500 ${
          hasError
            ? "border-red-400 focus:border-red-500"
            : "border-stone-300 focus:border-stone-500"
        }`}
      />

      {hasError && (
        <p className="text-xs text-red-600">時間は mm:ss 形式で入力してください</p>
      )}
    </div>
  )
}