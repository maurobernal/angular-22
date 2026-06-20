import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { DemoPage } from '../../shared/demo-page';

/**
 * CAP. 1 — Arquitectura Zoneless y OnPush como nuevo estándar.
 *
 * Caso: panel de telemetría de una turbina eólica que recibe datos a alta
 * frecuencia. Con zoneless + signals, solo se re-renderiza este componente
 * (actualización localizada O(1)), sin recorrer todo el árbol.
 */
@Component({
  selector: 'app-zoneless-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage],
  template: `
    <demo-page
      [chapter]="1"
      title="Zoneless + OnPush"
      concept="La actualización de un signal notifica al grafo y re-renderiza solo el componente afectado, sin zone.js."
    >
      <section
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-labelledby="turbine-title"
      >
        <h3 id="turbine-title" class="text-lg font-semibold">
          Monitoreo de Turbina #104
        </h3>

        <dl class="mt-4 grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-slate-50 p-4">
            <dt class="text-sm text-slate-500">Rotación por minuto (RPM)</dt>
            <dd class="mt-1 text-3xl font-bold tabular-nums">{{ rpm() }}</dd>
          </div>
          <div class="rounded-lg bg-slate-50 p-4">
            <dt class="text-sm text-slate-500">Temperatura del eje</dt>
            <dd
              class="mt-1 text-3xl font-bold tabular-nums"
              [class.text-red-600]="overheated()"
              [attr.aria-live]="overheated() ? 'assertive' : 'off'"
            >
              {{ temp() }}°C
            </dd>
          </div>
        </dl>

        @if (overheated()) {
          <p role="alert" class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            ⚠️ Temperatura por encima del umbral seguro (80°C).
          </p>
        }

        <div class="mt-4 flex items-center gap-3">
          <button
            type="button"
            (click)="toggle()"
            class="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            {{ running() ? 'Pausar' : 'Reanudar' }} telemetría
          </button>
          <span class="text-sm text-slate-500">Ticks recibidos: {{ ticks() }}</span>
        </div>
      </section>

      <aside class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p class="font-medium">¿Por qué re-renderiza sin zone.js?</p>
        <p class="mt-1">
          Cada <code>signal.set()/update()</code> marca este componente OnPush como "sucio".
          El planificador zoneless agenda un único ciclo de render y actualiza
          exclusivamente los nodos ligados a <code>rpm()</code> y <code>temp()</code>.
        </p>
      </aside>
    </demo-page>
  `,
})
export class ZonelessDemo {
  // Estado reactivo local con signals (CLAUDE.md: "Use signals for local component state").
  protected readonly rpm = signal(0);
  protected readonly temp = signal(45);
  protected readonly ticks = signal(0);
  protected readonly running = signal(true);

  // Estado derivado con computed (no se recalcula a mano).
  protected readonly overheated = computed(() => this.temp() > 80);

  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor() {
    // afterNextRender garantiza que el timer solo corre en el navegador (SSR-safe),
    // sustituyendo al patrón de comprobar isPlatformBrowser manualmente.
    afterNextRender(() => this.start());
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  protected toggle(): void {
    this.running.update((r) => !r);
    this.running() ? this.start() : this.stop();
  }

  private start(): void {
    this.stop();
    this.intervalId = setInterval(() => {
      this.rpm.set(Math.floor(15 + Math.random() * 5));
      this.temp.update((t) => {
        const delta = Math.random() > 0.5 ? 0.8 : -0.8;
        const next = Math.round((t + delta) * 10) / 10;
        return Math.min(90, Math.max(30, next));
      });
      this.ticks.update((n) => n + 1);
    }, 400);
  }

  private stop(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES (Eager / zone.js, hasta v17) — cómo se hacía lo mismo:
//
//   @Component({
//     selector: 'app-turbine-monitor',
//     // changeDetection: ChangeDetectionStrategy.Default  (recorría TODO el árbol)
//     template: `<strong>{{ rpm }}</strong> ... {{ temp }}°C`,
//   })
//   export class TurbineMonitor {
//     rpm = 0;            // propiedades planas, sin reactividad
//     temp = 45;
//     constructor() {
//       // zone.js parcheaba setInterval => tras CADA tick disparaba CD global O(N)
//       setInterval(() => { this.rpm = ...; this.temp = ...; }, 400);
//     }
//   }
//
// PDF (Cap. 1): proponía `ChangeDetectionStrategy.Eager` como reemplazo del antiguo
// `Default`. En este build estable el camino recomendado es OnPush + signals + zoneless,
// que es lo que muestra esta demo.
// ─────────────────────────────────────────────────────────────────────────────
