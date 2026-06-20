import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Chrome común de cada demo: encabezado con capítulo/título/concepto y zona de contenido.
 * Mantiene una sola estructura de headings (h2) para accesibilidad y consistencia visual.
 */
@Component({
  selector: 'demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mb-6 border-b border-slate-200 pb-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-violet-600">
        Capítulo {{ chapter() }}
      </p>
      <h2 class="mt-1 text-2xl font-bold text-slate-900">{{ title() }}</h2>
      <p class="mt-1 max-w-2xl text-slate-600">{{ concept() }}</p>
    </header>

    <div class="space-y-6">
      <ng-content />
    </div>
  `,
})
export class DemoPage {
  readonly chapter = input.required<number>();
  readonly title = input.required<string>();
  readonly concept = input.required<string>();
}
