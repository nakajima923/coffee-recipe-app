"use client"

import { useEffect, useRef, useState } from "react"
import { secondsToMMSS, mmssToSeconds } from "@/lib/time"

type Props = {
  value: number
  onChange: (seconds: number) => void
  disabled?: boolean
}

export function TimeInput({ value, onChange, disabled = false }: Props) {
  const [text, setText] = useState(secondsToMMSS(value))
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (!isFocusedRef.current) {
      setText(secondsToMMSS(value))
    }
  }, [value])

  function handleChange(v: string) {
    const sanitized = v.replace(/[^\d:]/g, "")
    setText(sanitized)

    if (/^\d{1,2}:\d{1,2}$/.test(sanitized) || /^\d+$/.test(sanitized)) {
      onChange(mmssToSeconds(sanitized))
    }
  }

  function handleBlur() {
    isFocusedRef.current = false
    const seconds = mmssToSeconds(text)
    onChange(seconds)
    setText(secondsToMMSS(seconds))
  }

  function handleFocus() {
    isFocusedRef.current = true
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder="0:30"
      disabled={disabled}
      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-500 disabled:bg-stone-100 disabled:text-stone-500"
    />
  )
}