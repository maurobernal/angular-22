import {
  ChangeDetectionStrategy,
  Component,
  injectAsync,
  onIdle,
  signal,
} from '@angular/core';
import { DemoPage } from '../../shared/demo-page';
import type { Transaction } from './excel-report-exporter';

/**
 * CAP. 5 — Inyección de dependencias moderna: @Service e inyección asíncrona.
 *
 * Caso: módulo de facturación. El exportador (servicio pesado) se carga en un
 * chunk aparte con injectAsync(); con prefetch onIdle se descarga en un momento
 * de inactividad del navegador, sin bloquear el hilo principal.
 */
@Component({
  selector: 'app-modern-di-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage],
  template: `
    <demo-page
      [chapter]="5"
      title="DI Moderna"
      concept="@Service() registra el singleton raíz sin boilerplate. injectAsync() hace code-splitting y prefetch en reposo del navegador."
    >
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">Historial de Facturación</h3>
        <ul class="mt-3 space-y-1 text-sm text-slate-600">
          @for (t of transactions(); track t.id) {
            <li>#{{ t.id }} — {{ t.amount }} €</li>
          }
        </ul>

        <button
          type="button"
          (click)="generateReport()"
          [disabled]="busy()"
          class="mt-4 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
        >
          {{ busy() ? 'Generando…' : 'Descargar informe' }}
        </button>

        @if (csv(); as content) {
          <pre
            class="mt-4 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100"
            aria-label="CSV generado"
          >{{ content }}</pre>
        }
      </section>
    </demo-page>
  `,
})
export class ModernDiDemo {
  protected readonly transactions = signal<Transaction[]>([
    { id: 1, amount: 250.5 },
    { id: 2, amount: 1420 },
  ]);
  protected readonly csv = signal<string | null>(null);
  protected readonly busy = signal(false);

  // Carga perezosa del servicio: el import() genera un chunk separado y el
  // prefetch lo descarga cuando el navegador entra en reposo (timeout 2000ms).
  private readonly exporterLoader = injectAsync(
    () => import('./excel-report-exporter').then((m) => m.ExcelReportExporter),
    { prefetch: () => onIdle({ timeout: 2000 }) },
  );

  protected async generateReport(): Promise<void> {
    this.busy.set(true);
    // Al resolver la promesa, Angular devuelve la instancia única inyectada.
    const exporter = await this.exporterLoader();
    this.csv.set(exporter.exportData(this.transactions()));
    this.busy.set(false);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES — carga perezosa "a mano" o servicio siempre incluido en el bundle inicial:
//
//   constructor(private injector: Injector) {}
//   async generate() {
//     const { ExcelReportExporter } = await import('./excel-report-exporter');
//     const exporter = this.injector.get(ExcelReportExporter); // requería proveerlo manualmente
//     ...
//   }
//   // injectAsync + prefetch onIdle encapsula el code-splitting y la descarga ociosa.
// ─────────────────────────────────────────────────────────────────────────────
