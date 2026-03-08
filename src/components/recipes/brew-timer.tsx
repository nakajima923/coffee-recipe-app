"use client"

import { useEffect, useMemo, useState } from "react"

type Pour = {
  id: string
  pour_index: number
  elapsed_time_sec: number
  water_ml: number
  note: string
}

type Props = {
  recipeTitle: string
  pours: Pour[]
}

function formatSeconds(seconds: number) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

export function BrewTimer({ pours }: Props) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    const id = window.setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(id)
  }, [isRunning])

  const currentPour = useMemo(() => {
    if (pours.length === 0) return null

    for (let i = pours.length - 1; i >= 0; i -= 1) {
      if (elapsed >= pours[i].elapsed_time_sec) {
        return pours[i]
      }
    }

    return pours[0]
  }, [elapsed, pours])

  const nextPour = useMemo(() => {
    if (!currentPour) return null
    return pours.find((pour) => pour.pour_index === currentPour.pour_index + 1) ?? null
  }, [currentPour, pours])

  return (
    <div className="flex flex-1 flex-col">
      <div className="rounded-[2rem] bg-stone-900 p-6 text-center shadow-lg">
        <p className="text-sm text-stone-400">現在のタイマー</p>
        <p className="mt-3 text-6xl font-semibold tracking-tight">
          {formatSeconds(elapsed)}
        </p>
      </div>

      <div className="mt-5 rounded-[2rem] bg-stone-900 p-5">
        <p className="text-sm text-stone-400">今の投</p>

        {currentPour ? (
          <div className="mt-4 space-y-3">
            <p className="text-2xl font-semibold">{currentPour.pour_index}投目</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-stone-800 p-4">
                <p className="text-xs text-stone-400">時間</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatSeconds(currentPour.elapsed_time_sec)}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-800 p-4">
                <p className="text-xs text-stone-400">湯量</p>
                <p className="mt-1 text-2xl font-semibold">
                  {currentPour.water_ml}ml
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-stone-800 p-4">
              <p className="text-xs text-stone-400">メモ</p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                {currentPour.note || "メモなし"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-stone-300">投数データがありません。</p>
        )}
      </div>

      {nextPour && (
        <div className="mt-4 rounded-[2rem] bg-stone-900 p-5">
          <p className="text-sm text-stone-400">次の投</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-semibold">{nextPour.pour_index}投目</p>
            <p className="text-lg font-semibold">
              {formatSeconds(nextPour.elapsed_time_sec)} / {nextPour.water_ml}ml
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {pours.map((pour) => {
          const active = currentPour?.id === pour.id

          return (
            <div
              key={pour.id}
              className={`rounded-2xl border p-4 transition ${
                active
                  ? "border-stone-300 bg-stone-100 text-stone-900"
                  : "border-stone-800 bg-stone-900 text-stone-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{pour.pour_index}投目</p>
                <p className="text-sm">
                  {formatSeconds(pour.elapsed_time_sec)} / {pour.water_ml}ml
                </p>
              </div>
            </div>
          )
        })}
      </div>

        <div className="sticky bottom-0 mt-6 bg-gradient-to-t from-stone-950 via-stone-950 to-transparent pt-6 sm:static sm:bg-none sm:pt-2">
        <div className="grid grid-cols-3 gap-3 sm:max-w-md sm:ml-auto">
            <button
            onClick={() => setElapsed(0)}
            className="rounded-2xl border border-stone-700 bg-stone-900 px-4 py-4 text-sm font-medium text-stone-100"
            >
            リセット
            </button>

            <button
            onClick={() => setIsRunning(false)}
            className="rounded-2xl border border-stone-700 bg-stone-900 px-4 py-4 text-sm font-medium text-stone-100"
            >
            一時停止
            </button>

            <button
            onClick={() => setIsRunning(true)}
            className="rounded-2xl bg-white px-4 py-4 text-sm font-medium text-stone-900"
            >
            スタート
            </button>
        </div>
        </div>
    </div>
  )
}