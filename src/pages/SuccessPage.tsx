import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-coc-accent-light mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">Postać Zapisana!</h2>
        <p className="text-coc-text-muted mb-6">
          Twój Badacz został pomyślnie utworzony i przesłany do Strażnika Tajemnic.
          Eksport postaci jest dostępny w panelu administracyjnym.
        </p>
        <Link to="/">
          <Button variant="secondary">Powrót na stronę główną</Button>
        </Link>
      </Card>
    </div>
  )
}
