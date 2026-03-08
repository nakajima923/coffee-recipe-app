import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-stone-600 transition hover:text-stone-900"
          >
            ← Dashboard に戻る
          </Link>
        </div>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            このサービスについて
          </h1>

          <div className="mt-6 space-y-6 text-sm leading-7 text-stone-700 sm:text-base">
            <section>
              <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
                免責事項
              </h2>
              <p className="mt-2">
                このサービスは個人開発の試験的なサービスです。
                今後、予告なく仕様変更・停止・終了する場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
                データについて
              </h2>
              <p className="mt-2">
                登録されたレシピデータの保存・継続提供は保証していません。
                不具合、メンテナンス、サービス終了などにより、
                登録データが消失する可能性があります。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
                ご利用にあたって
              </h2>
              <p className="mt-2">
                大切なデータについては、このサービスのみを保存先にせず、
                必要に応じてご自身でもメモやバックアップを取ってください。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
                補足
              </h2>
              <p className="mt-2">
                できる限り安心して使えるよう改善していきますが、
                現時点では「個人で気軽に使う記録サービス」としてご利用ください。
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}