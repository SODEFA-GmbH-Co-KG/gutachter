'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import {
  GENERATION_CATEGORIES,
  type GenerateFormData,
} from './generation-config'

export function CheckboxMatrix() {
  const { setValue, watch } = useFormContext<GenerateFormData>()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {(
        Object.entries(GENERATION_CATEGORIES) as Array<
          [
            keyof typeof GENERATION_CATEGORIES,
            (typeof GENERATION_CATEGORIES)[keyof typeof GENERATION_CATEGORIES],
          ]
        >
      ).map(([categoryKey, category]) => (
        <Card key={categoryKey}>
          <CardHeader>
            <CardTitle className="text-lg">{category.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {Object.entries(category.groups).map(([groupKey, group]) => {
              const fieldPath =
                `${categoryKey}.${groupKey}` as keyof GenerateFormData extends never
                  ? string
                  : `${typeof categoryKey}.${string}`
              const currentValue = (watch(fieldPath as 'lage.makrolage') ??
                '') as string

              return (
                <div key={groupKey} className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {group.label}
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={currentValue}
                    onValueChange={(val: string) => {
                      if (val) {
                        setValue(fieldPath as 'lage.makrolage', val as never, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {(group.options as readonly string[]).map(
                      (option: string) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          size="sm"
                          className={cn(
                            'rounded-full border border-border px-3 py-1 text-xs',
                            'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary',
                          )}
                        >
                          {option}
                        </ToggleGroupItem>
                      ),
                    )}
                  </ToggleGroup>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
