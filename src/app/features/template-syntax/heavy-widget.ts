import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * CAP. 7 — Widget "pesado" usado solo dentro de un bloque @defer.
 * Al estar referenciado únicamente en @defer, su código se carga en un chunk aparte.
 */
@Component({
  selector: 'app-heavy-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 p-6 text-white">
      <p class="text-sm uppercase tracking-wide opacity-80">Visualización 3D</p>
      <p class="mt-1 text-2xl font-bold">Render cargado bajo demanda 🎉</p>
    </div>
  `,
})
export class HeavyWidget {}
