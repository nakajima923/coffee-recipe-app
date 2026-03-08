"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/time-input"

type PourInput = {
  pour_index: number
  water_ml: number
  elapsed_time_sec: number
  note: string
}

type FormData = {
  title: string
  bean_name: string
  roast_level: string
  grind_size: string
  bean_amount_g: number
  water_amount_ml: number
  pours_count: number
  water_temp_c: number
  total_time_sec: number
  memo: string
  is_favorite: boolean
  is_public: boolean
}

type RecipeFormProps = {
  mode?: "create" | "edit"
  recipeId?: string
  initialValues?: Partial<FormData>
  initialPours?: PourInput[]
}

export function RecipeForm({
  mode = "create",
  recipeId,
  initialValues,
  initialPours,
}: RecipeFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [pours, setPours] = useState<PourInput[]>(
    initialPours && initialPours.length > 0
      ? initialPours
      : [{ pour_index: 1, water_ml: 0, elapsed_time_sec: 30, note: "" }]
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: initialValues?.title ?? "",
      bean_name: initialValues?.bean_name ?? "",
      roast_level: initialValues?.roast_level ?? "",
      grind_size: initialValues?.grind_size ?? "",
      bean_amount_g: initialValues?.bean_amount_g ?? 15,
      water_amount_ml: initialValues?.water_amount_ml ?? 240,
      pours_count: initialValues?.pours_count ?? Math.max(initialPours?.length ?? 1, 1),
      water_temp_c: initialValues?.water_temp_c ?? 90,
      total_time_sec: initialValues?.total_time_sec ?? 150,
      memo: initialValues?.memo ?? "",
      is_favorite: initialValues?.is_favorite ?? false,
      is_public: initialValues?.is_public ?? false,
    },
  })

  const poursCount = watch("pours_count") || 1

  useEffect(() => {
    const safeCount = Math.max(1, Number(poursCount) || 1)

    setPours((prev) => {
      const next = Array.from({ length: safeCount }, (_, index) => {
        const existing = prev[index]
        return (
          existing ?? {
            pour_index: index + 1,
            water_ml: 0,
            elapsed_time_sec: index === 0 ? 0 : (index + 1) * 30,
            note: "",
          }
        )
      })

      return next.map((pour, index) => ({
        ...pour,
        pour_index: index + 1,
      }))
    })
  }, [poursCount])

  const updatePour = (
    index: number,
    key: keyof PourInput,
    value: string | number
  ) => {
    setPours((prev) =>
      prev.map((pour, i) =>
        i === index
          ? {
              ...pour,
              [key]: value,
            }
          : pour
      )
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    setErrorMessage("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setErrorMessage("ログイン情報が取得できませんでした。")
        toast.error("ログイン情報が取得できませんでした。")
        return
      }

      const normalizedPours = pours.map((pour, index) => ({
        pour_index: index + 1,
        water_ml: Number(pour.water_ml),
        elapsed_time_sec: index === 0 ? 0 : Number(pour.elapsed_time_sec),
        note: pour.note?.trim() || null,
      }))

      const invalidPour = normalizedPours.some(
      (pour) =>
          !Number.isFinite(pour.water_ml) ||
          pour.water_ml <= 0 ||
          !Number.isFinite(pour.elapsed_time_sec) ||
          pour.elapsed_time_sec < 0
      )

      if (invalidPour) {
        setErrorMessage("各投の湯量は 1ml 以上で入力してください。")
        toast.error("各投の湯量は 1ml 以上で入力してください。")
        return
      }

      const recipePayload = {
        title: data.title.trim(),
        bean_name: data.bean_name.trim() || null,
        roast_level: data.roast_level.trim() || null,
        grind_size: data.grind_size.trim() || null,
        bean_amount_g: Number(data.bean_amount_g),
        water_amount_ml: Number(data.water_amount_ml),
        pours_count: Number(data.pours_count),
        water_temp_c: Number(data.water_temp_c) || null,
        total_time_sec: Number(data.total_time_sec) || null,
        memo: data.memo.trim() || null,
        is_favorite: Boolean(data.is_favorite),
        is_public: Boolean(data.is_public),
      }

      if (mode === "create") {
        const { data: insertedRecipe, error: recipeError } = await supabase
          .from("recipes")
          .insert({
            ...recipePayload,
            user_id: user.id,
          })
          .select("id")
          .single()

        if (recipeError || !insertedRecipe) {
          setErrorMessage("レシピの保存に失敗しました。")
          toast.error("レシピの保存に失敗しました。")
          return
        }

        const { error: poursError } = await supabase.from("recipe_pours").insert(
          normalizedPours.map((pour) => ({
            recipe_id: insertedRecipe.id,
            pour_index: pour.pour_index,
            water_ml: pour.water_ml,
            elapsed_time_sec: pour.elapsed_time_sec,
            note: pour.note,
          }))
        )

        if (poursError) {
          setErrorMessage("投数データの保存に失敗しました。")
          toast.error("投数データの保存に失敗しました。")
          return
        }

        toast.success("レシピを保存しました。")
        router.push(`/recipes/${insertedRecipe.id}`)
        router.refresh()
        return
      }

      if (!recipeId) {
        setErrorMessage("編集対象のレシピIDがありません。")
        toast.error("編集対象のレシピIDがありません。")
        return
      }

      const { error: updateError } = await supabase
        .from("recipes")
        .update(recipePayload)
        .eq("id", recipeId)
        .eq("user_id", user.id)

      if (updateError) {
        setErrorMessage("レシピの更新に失敗しました。")
        toast.error("レシピの更新に失敗しました。")
        return
      }

      const { error: deletePoursError } = await supabase
        .from("recipe_pours")
        .delete()
        .eq("recipe_id", recipeId)

      if (deletePoursError) {
        setErrorMessage("既存の投数データ削除に失敗しました。")
        toast.error("既存の投数データ削除に失敗しました。")
        return
      }

      const { error: insertPoursError } = await supabase
        .from("recipe_pours")
        .insert(
          normalizedPours.map((pour) => ({
            recipe_id: recipeId,
            pour_index: pour.pour_index,
            water_ml: pour.water_ml,
            elapsed_time_sec: pour.elapsed_time_sec,
            note: pour.note,
          }))
        )

      if (insertPoursError) {
        setErrorMessage("投数データの更新に失敗しました。")
        toast.error("投数データの更新に失敗しました。")
        return
      }

      toast.success("レシピを更新しました。")
      router.push(`/recipes/${recipeId}`)
      router.refresh()
    } catch {
      setErrorMessage("予期しないエラーが発生しました。")
      toast.error("予期しないエラーが発生しました。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <section className="space-y-4">
        <div>
          <Label className="mb-2 block">レシピ名</Label>
          <Input
            {...register("title", { required: "レシピ名は必須です" })}
            placeholder="V60 エチオピア"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-2 block">豆名</Label>
            <Input {...register("bean_name")} placeholder="Ethiopia" />
          </div>

          <div>
            <Label className="mb-2 block">焙煎度</Label>
            <Input {...register("roast_level")} placeholder="Light" />
          </div>

          <div>
            <Label className="mb-2 block">挽き目</Label>
            <Input {...register("grind_size")} placeholder="Medium" />
          </div>

          <div>
            <Label className="mb-2 block">投数</Label>
            <Input
              {...register("pours_count", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              type="number"
              min={1}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-2 block">豆量(g)</Label>
            <Input
              {...register("bean_amount_g", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              type="number"
              step="0.1"
              min={1}
            />
          </div>

          <div>
            <Label className="mb-2 block">水量(ml)</Label>
            <Input
              {...register("water_amount_ml", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              type="number"
              min={1}
            />
          </div>

            <div>
            <Label className="mb-2 block">湯温(℃)</Label>
            <Input
                {...register("water_temp_c", {
                valueAsNumber: true,
                })}
                type="number"
                min={0}
                placeholder="90"
            />
            </div>

              <div>
                <Label className="mb-2 block">総抽出時間</Label>
                <TimeInput
                value={watch("total_time_sec") || 0}
                onChange={(seconds) => setValue("total_time_sec", seconds)}
                />
            </div>
        </div>

        <div>
          <Label className="mb-2 block">メモ</Label>
          <Textarea
            {...register("memo")}
            placeholder="柑橘感が強い / 2投目はややゆっくり"
            className="min-h-28"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-stone-200 p-4">
            <input type="checkbox" {...register("is_favorite")} />
            <div>
              <p className="font-medium text-stone-900">お気に入り</p>
              <p className="text-sm text-stone-600">
                ダッシュボードで目立たせるためのフラグです
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-stone-200 p-4">
            <input type="checkbox" {...register("is_public")} />
            <div>
              <p className="font-medium text-stone-900">公開する</p>
              <p className="text-sm text-stone-600">
                将来の公開一覧や共有機能に使う公開設定です
              </p>
            </div>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">各投の設定</h2>
          <p className="mt-1 text-sm text-stone-600">
            投数に合わせて、各投の湯量とメモを記録できます。
          </p>
        </div>

        <div className="space-y-3">
          {pours.map((pour, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
            >
              <div className="mb-3 text-sm font-medium text-stone-800">
                {index + 1}投目
              </div>

              <div className="grid gap-3 sm:grid-cols-[140px_140px_1fr]">
                <div>
                <Label className="mb-2 block">時間</Label>

                {index === 0 ? (
                    <Input value="0:00" disabled />
                ) : (
                    <TimeInput
                    value={pour.elapsed_time_sec || 0}
                    onChange={(seconds) =>
                        updatePour(index, "elapsed_time_sec", seconds)
                    }
                    />
                )}
                </div>

                <div>
                <Label className="mb-2 block">湯量(ml)</Label>
                <Input
                    type="number"
                    min={1}
                    value={pour.water_ml || ""}
                    onChange={(e) =>
                    updatePour(index, "water_ml", Number(e.target.value))
                    }
                />
                </div>

                <div>
                <Label className="mb-2 block">メモ</Label>
                <Input
                    type="text"
                    value={pour.note}
                    onChange={(e) => updatePour(index, "note", e.target.value)}
                    placeholder="ゆっくり注ぐ / 中心寄り"
                />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {errorMessage && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving
          ? mode === "create"
            ? "保存中..."
            : "更新中..."
          : mode === "create"
            ? "保存する"
            : "更新する"}
      </Button>
    </form>
  )
}