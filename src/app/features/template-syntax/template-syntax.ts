import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DemoPage } from '../../shared/demo-page';
import { HeavyWidget } from './heavy-widget';

/**
 * CAP. 7 — Optimizaciones sintácticas de plantilla.
 *
 * Muestra: @let, funciones flecha inline en expresiones, spread de objetos en
 * bindings, control de flujo nativo (@if/@for/@switch) y carga diferida con @defer.
 */
@Component({
  selector: 'app-template-syntax-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage, HeavyWidget],
  template: `
    <demo-page
      [chapter]="7"
      title="Sintaxis de Plantilla"
      concept="@let, arrow functions inline, spread en bindings, control de flujo nativo y @defer para diferir lo pesado."
    >
      <!-- @let: variable local calculada una vez por el template -->
      @let pares = numbers().filter((n) => n % 2 === 0);

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">&#64;let + arrow function inline</h3>
        <p class="mt-2 text-sm text-slate-600">Números: {{ numbers().join(', ') }}</p>
        <!-- arrow function inline dentro de la expresión de plantilla -->
        <p class="text-sm text-slate-600">Pares: {{ pares.join(', ') }}</p>

        <div class="mt-3 flex items-center gap-3">
          <button
            type="button"
            (click)="addRandom()"
            class="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Agregar número
          </button>
          <span class="text-sm">Total pares: {{ pares.length }}</span>
        </div>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">Spread en bindings + &#64;switch</h3>
        <!-- spread de objetos directamente en el binding [style] -->
        <div [style]="{ ...baseStyles, ...customTheme() }" class="mt-3 rounded-md">
          <span>Tema dinámico vía spread</span>
        </div>
        <button
          type="button"
          (click)="toggleTheme()"
          class="mt-3 rounded-md border border-violet-600 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
        >
          Cambiar tema
        </button>
        <p class="mt-2 text-sm">
          @switch (theme()) {
            @case ('gold') { Tema: dorado }
            @case ('cyan') { Tema: cian }
            @default { Tema: por defecto }
          }
        </p>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">&#64;defer (carga diferida)</h3>
        <p class="mt-1 text-sm text-slate-600">El widget pesado se carga al entrar en viewport.</p>
        <div class="mt-3">
          @defer (on viewport) {
            <app-heavy-widget />
          } @placeholder {
            <div class="rounded-lg bg-slate-100 p-6 text-center text-slate-400">
              Desplazá para cargar…
            </div>
          } @loading (minimum 300ms) {
            <div class="rounded-lg bg-slate-100 p-6 text-center text-slate-400" role="status">
              Cargando widget…
            </div>
          }
        </div>
      </section>

      <aside class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p class="font-medium">Sobre &#64;boundary / &#64;catch (PDF, Cap. 7)</p>
        <p class="mt-1">
          El error boundary de plantilla (<code>&#64;boundary</code> / <code>&#64;catch</code>)
          es Developer Preview y no está disponible en este build estable. Para aislar
          fallos hoy se usa un <code>ErrorHandler</code> propio o se encapsula el
          subcomponente inestable.
        </p>
      </aside>
    </demo-page>
  `,
})
export class TemplateSyntaxDemo {
  protected readonly numbers = signal<number[]>([1, 2, 3, 4]);
  protected readonly theme = signal<'default' | 'gold' | 'cyan'>('default');

  protected readonly baseStyles = {
    display: 'flex',
    'align-items': 'center',
    gap: '8px',
    padding: '16px',
    color: 'white',
  };

  protected readonly customTheme = computed(() => {
    switch (this.theme()) {
      case 'gold':
        return { background: '#b8860b' };
      case 'cyan':
        return { background: '#0e7490' };
      default:
        return { background: '#475569' };
    }
  });

  protected addRandom(): void {
    this.numbers.update((ns) => [...ns, Math.floor(Math.random() * 100)]);
  }

  protected toggleTheme(): void {
    this.theme.update((t) => (t === 'default' ? 'gold' : t === 'gold' ? 'cyan' : 'default'));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES — *ngIf/*ngFor/*ngSwitch y sin @let:
//   <div *ngIf="cliente as c">...</div>
//   <li *ngFor="let n of numbers">{{ n }}</li>
//   <ng-container [ngSwitch]="theme"><span *ngSwitchCase="'gold'">...</span></ng-container>
//   <!-- ngx-deferred / IntersectionObserver manual en lugar de @defer -->
// ─────────────────────────────────────────────────────────────────────────────
