import {
  ChangeDetectionStrategy,
  Component,
  computed,
  declareExperimentalWebMcpTool,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DemoPage } from '../../shared/demo-page';

interface Plan {
  id: string;
  label: string;
}

const PLANS: Plan[] = [
  { id: 'free', label: 'Gratis' },
  { id: 'pro', label: 'Pro' },
  { id: 'enterprise', label: 'Empresa' },
];

/**
 * CAP. 8 — Accesibilidad estable (patrones ARIA) + herramientas WebMCP para IA.
 *
 * - Listbox accesible: role=listbox/option, aria-selected, roving tabindex y
 *   navegación con flechas (WCAG AA, foco gestionado).
 * - WebMCP: se registra una herramienta que un agente de IA puede invocar para
 *   leer el plan seleccionado, sin escanear el DOM.
 */
@Component({
  selector: 'app-aria-webmcp-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage],
  template: `
    <demo-page
      [chapter]="8"
      title="Accesibilidad + WebMCP"
      concept="Patrones ARIA con foco gestionado y navegación por teclado, más herramientas WebMCP que exponen capacidades a agentes de IA."
    >
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 id="plan-label" class="text-lg font-semibold">Elegí un plan</h3>
        <ul
          role="listbox"
          aria-labelledby="plan-label"
          class="mt-3 max-w-xs space-y-1"
          (keydown)="onKeydown($event)"
        >
          @for (plan of plans; track plan.id; let i = $index) {
            <li
              role="option"
              [id]="'plan-' + plan.id"
              [attr.aria-selected]="selectedIndex() === i"
              [tabindex]="selectedIndex() === i ? 0 : -1"
              (click)="select(i)"
              class="cursor-pointer rounded-md px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              [class.bg-violet-600]="selectedIndex() === i"
              [class.text-white]="selectedIndex() === i"
              [class.hover:bg-slate-100]="selectedIndex() !== i"
            >
              {{ plan.label }}
            </li>
          }
        </ul>
        <p class="mt-3 text-sm text-slate-600" aria-live="polite">
          Seleccionado: <strong>{{ selectedPlan().label }}</strong>
        </p>
      </section>

      <aside class="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <p class="font-medium">Herramienta WebMCP registrada</p>
        <p class="mt-1">
          Se declaró <code>get_selected_plan</code>: un agente conectado por WebMCP
          puede llamarla para conocer el plan elegido sin inspeccionar el DOM.
          (Se registra solo en el navegador y se libera al destruir el componente.)
        </p>
      </aside>
    </demo-page>
  `,
})
export class AriaWebmcpDemo {
  protected readonly plans = PLANS;
  protected readonly selectedIndex = signal(0);
  protected readonly selectedPlan = computed(() => this.plans[this.selectedIndex()]);

  constructor() {
    // El registro de la herramienta corre en contexto de inyección (constructor).
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      declareExperimentalWebMcpTool({
        name: 'get_selected_plan',
        description: 'Devuelve el plan de suscripción actualmente seleccionado por el usuario.',
        inputSchema: { type: 'object', properties: {} },
        execute: () => ({ plan: this.selectedPlan().id, label: this.selectedPlan().label }),
      });
    }
  }

  protected select(index: number): void {
    this.selectedIndex.set(index);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const last = this.plans.length - 1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.selectedIndex.update((i) => (i === last ? 0 : i + 1));
      this.focusSelected();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.selectedIndex.update((i) => (i === 0 ? last : i - 1));
      this.focusSelected();
    }
  }

  private focusSelected(): void {
    const id = `plan-${this.selectedPlan().id}`;
    document.getElementById(id)?.focus();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF (Cap. 8): el paquete @angular/aria (12 directivas accesibles) no está
// instalado en este proyecto, así que implementamos el patrón listbox con ARIA
// nativo. La configuración global de herramientas IA es:
//
//   // app.config.ts
//   provideExperimentalWebMcpTools([
//     declareExperimentalWebMcpTool({ name: 'fetch_system_status', ... }),
//   ])
// ─────────────────────────────────────────────────────────────────────────────
