export async function recordGenerationBilling(params: {
  userId: string
  generationId: string
  durationMs: number
}) {
  // TODO: Integrate with CRM billing API
  console.log('[CRM Billing]', {
    action: 'generation_completed',
    ...params,
    timestamp: new Date().toISOString(),
  })
}
