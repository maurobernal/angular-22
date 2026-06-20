import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/**
 * CAP. 2 — Componente de insignia de precio.
 *
 * En la era selectorless se OMITE la propiedad `selector` y Angular usa el nombre
 * de la clase (PascalCase) como tag: `<PriceBadge [value]="120" />`.
 *
 * Como la sintaxis selectorless es experimental (requiere habilitar el flag del
 * compilador), aquí mantenemos un selector para que el ejemplo compile y corra hoy.
 * Ver el bloque comentado en `selectorless.ts` para la variante sin selector.
 */
@Component({
  selector: 'app-price-badge, PriceBadge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <span
      class="inline-flex items-center rounded-md bg-emerald-600 px-2 py-1 text-sm font-semibold text-white"
    >
      Precio: {{ value() | currency: 'EUR' }}
    </span>
  `,
})
export class PriceBadge {
  readonly value = input.required<number>();
}
