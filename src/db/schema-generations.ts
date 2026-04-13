import { relations } from 'drizzle-orm'
import { index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { createdUpdatedAtColumns, idColumn } from './commonColumns'
import { users } from './schema-auth'
import { zodEnumToCustomType } from './zodEnumToCustomType'

export const GenerationStatus = z.enum([
  'pending',
  'streaming',
  'completed',
  'failed',
])
export type GenerationStatus = z.infer<typeof GenerationStatus>

export const generations = pgTable(
  'generation',
  {
    id: idColumn(),
    ...createdUpdatedAtColumns(),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    checkboxData: jsonb('checkbox_data').notNull(),
    fileNames: jsonb('file_names').notNull().$type<string[]>(),
    resultText: text('result_text').notNull().default(''),
    status: zodEnumToCustomType(GenerationStatus)('status')
      .notNull()
      .default('pending'),
    durationMs: integer('duration_ms'),
    errorText: text('error_text'),
  },
  (t) => [index('generation_userId_createdAt_idx').on(t.userId, t.createdAt)],
)

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
}))
