import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-4xl font-serif font-bold mb-2">404</h2>
      <p className="text-coc-text-muted mb-6">
        Ta strona zaginęła w mrocznych czeluściach...
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-coc-accent hover:bg-coc-accent-light text-white rounded-lg transition-colors"
      >
        Powrót na stronę główną
      </Link>
    </div>
  )
}
