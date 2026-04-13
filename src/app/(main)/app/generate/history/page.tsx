import { getMyUserOrLogin } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/db/db'
import { generations } from '@/db/schema-generations'
import { superCache } from '@/lib/superCache'
import { desc, eq } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'
import Link from 'next/link'

async function getGenerations(userId: string) {
  'use cache'
  superCache.userGenerations({ userId }).tag()

  return db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId))
    .orderBy(desc(generations.createdAt))
    .limit(50)
}

export default async function Page() {
  const user = await getMyUserOrLogin({
    forceRedirectUrl: '/app/generate/history',
  })

  const items = await getGenerations(user.id)

  return (
    <>
      <TopHeader>Generierungsverlauf</TopHeader>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Noch keine Gutachten generiert.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-start gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.createdAt, {
                        addSuffix: true,
                        locale: de,
                      })}
                    </span>
                    {item.durationMs && (
                      <span className="text-xs text-muted-foreground">
                        {(item.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.resultText
                      ? item.resultText.slice(0, 200)
                      : item.errorText || 'Keine Ausgabe'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/app/generate"
          className="text-sm text-primary hover:underline"
        >
          Neues Gutachten generieren
        </Link>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'completed'
      ? 'default'
      : status === 'failed'
        ? 'destructive'
        : ('secondary' as const)

  const label =
    status === 'completed'
      ? 'Fertig'
      : status === 'failed'
        ? 'Fehler'
        : status === 'streaming'
          ? 'Laeuft...'
          : 'Ausstehend'

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  )
}
