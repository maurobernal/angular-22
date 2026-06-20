import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoPage } from '../../shared/demo-page';
import { PriceBadge } from './price-badge';
import { Tooltip } from './tooltip';

/**
 * CAP. 2 — Componentes Selectorless e importaciones implícitas en plantillas.
 *
 * Caso: catálogo de e-commerce que compone una insignia de precio (PriceBadge)
 * y una directiva de comportamiento (Tooltip) de forma desacoplada.
 */
@Component({
  selector: 'app-selectorless-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // En selectorless puro este arreglo desaparece: el compilador resuelve las
  // dependencias leyendo los `import` de ESM de la cabecera del archivo.
  imports: [DemoPage, PriceBadge, Tooltip],
  template: `
    <demo-page
      [chapter]="2"
      title="Selectorless"
      concept="Componentes y directivas sin selector; el nombre de la clase es el tag y los import de ESM resuelven las dependencias (tree-shaking)."
    >
      <article class="max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-semibold">Gafas de Sol Deportivas</h3>
        <p class="mt-1 text-sm text-slate-500">Lente polarizada · UV400</p>

        <div class="mt-4">
          <!-- Hoy (con selector): <app-price-badge> / alias PascalCase <PriceBadge> -->
          <PriceBadge [value]="120" />
        </div>

        <button
          type="button"
          appTooltip="Añadir al carrito de compras"
          class="mt-4 w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Añadir
        </button>
      </article>

      <aside class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p class="font-medium">Estado de la feature</p>
        <p class="mt-1">
          La sintaxis 100% selectorless (<code>&lt;PriceBadge/&gt;</code> sin selector y
          <code>&#64;Tooltip</code>) es experimental y se habilita con un flag del compilador.
          Esta demo usa selectores para compilar hoy; abajo, en el código, está la
          variante selectorless comentada.
        </p>
      </aside>
    </demo-page>
  `,
})
export class SelectorlessDemo {}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES (Angular ≤ 21) — acoplamiento por strings de selector:
//
//   @Component({
//     selector: 'app-product-catalog',
//     imports: [PriceBadge, TooltipDirective],          // mantenimiento manual
//     template: `
//       <app-price-badge [value]="120"></app-price-badge> <!-- tag = string CSS -->
//       <button appTooltip="Añadir">Añadir</button>
//     `,
//   })
//
// SELECTORLESS PURO (PDF, Cap. 2) — se omite `selector` e `imports`:
//
//   // price-badge.ts
//   @Component({ template: `...` })                      // sin selector
//   export class PriceBadge { value = input.required<number>(); }
//
//   // tooltip.ts
//   @Directive()                                         // sin selector
//   export class Tooltip { text = input.required<string>(); }
//
//   // catalog.ts
//   import { PriceBadge } from './price-badge';           // <- ESM resuelve todo
//   import { Tooltip } from './tooltip';
//   @Component({
//     // sin `imports`
//     template: `
//       <PriceBadge [value]="120" />                      <!-- tag = nombre de clase -->
//       <button @Tooltip="'Añadir al carrito'">Añadir</button>
//     `,
//   })
//   export class ProductCatalog {}
// ─────────────────────────────────────────────────────────────────────────────
