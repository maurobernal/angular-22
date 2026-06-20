import {
  ChangeDetectionStrategy,
  Component,
  resource,
  resourceFromSnapshots,
  ResourceSnapshot,
  signal,
} from '@angular/core';
import { DemoPage } from '../../shared/demo-page';

interface Client {
  id: number;
  name: string;
}
interface Ticket {
  id: string;
  title: string;
  severity: 'high' | 'low';
}

// Simulación de backend (en producción serían llamadas HTTP reales).
const CLIENTS: Record<number, Client> = {
  1: { id: 1, name: 'Acme Corp' },
  2: { id: 2, name: 'Globex S.A.' },
};
const TICKETS: Record<number, Ticket[]> = {
  1: [
    { id: 'T-1', title: 'Caída del checkout', severity: 'high' },
    { id: 'T-2', title: 'Typo en el footer', severity: 'low' },
    { id: 'T-3', title: 'Fuga de memoria en reportes', severity: 'high' },
  ],
  2: [{ id: 'T-9', title: 'Lentitud al exportar', severity: 'low' }],
};
const wait = <T,>(value: T, ms: number) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

/**
 * CAP. 3 — Resource API estable: datos asíncronos como señales auto-gestionadas.
 *
 * Caso: panel de soporte. Se carga el cliente; al resolverse, se encadena
 * (chain) la carga de sus tickets; y a partir del snapshot de tickets se deriva
 * localmente la lista de tickets críticos SIN volver a pegarle al servidor.
 */
@Component({
  selector: 'app-resource-api-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage],
  template: `
    <demo-page
      [chapter]="3"
      title="Resource API"
      concept="resource()/httpResource exponen estado asíncrono como signals. chain() encadena dependencias y resourceFromSnapshots deriva sin nuevas peticiones."
    >
      <div class="flex gap-3">
        <button
          type="button"
          (click)="selectClient(1)"
          class="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Cargar Cliente 1
        </button>
        <button
          type="button"
          (click)="selectClient(2)"
          class="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Cargar Cliente 2
        </button>
      </div>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-live="polite">
        @if (clientResource.isLoading()) {
          <p class="text-slate-500">Cargando perfil del cliente…</p>
        } @else if (clientResource.value(); as client) {
          <h3 class="text-lg font-semibold">Historial de: {{ client.name }}</h3>

          @if (ticketsResource.isLoading()) {
            <p class="mt-2 text-slate-500">Cargando tickets de soporte…</p>
          } @else if (criticalTickets.value(); as criticals) {
            <h4 class="mt-3 font-medium">
              Alertas críticas (Total: {{ criticals.length }})
            </h4>
            <ul class="mt-2 space-y-1">
              @for (ticket of criticals; track ticket.id) {
                <li class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {{ ticket.title }}
                </li>
              } @empty {
                <li class="text-sm text-slate-500">Sin tickets de criticidad severa.</li>
              }
            </ul>
          }
        } @else {
          <p class="text-slate-500">Elegí un cliente para empezar.</p>
        }
      </section>
    </demo-page>
  `,
})
export class ResourceApiDemo {
  protected readonly selectedClientId = signal<number | undefined>(undefined);

  // Recurso 1: perfil del cliente. Si params() es undefined, el recurso queda 'idle'.
  protected readonly clientResource = resource({
    params: () => this.selectedClientId(),
    loader: ({ params }) => wait(CLIENTS[params], 600),
  });

  // Recurso 2: tickets, encadenados al recurso anterior con ctx.chain().
  // chain(clientResource) espera a que el cliente resuelva y devuelve su valor;
  // si el cliente falla, este recurso se bloquea (ResourceDependencyError).
  protected readonly ticketsResource = resource({
    params: (ctx) => ctx.chain(this.clientResource)?.id,
    loader: ({ params }) => wait(TICKETS[params] ?? [], 600),
    defaultValue: [] as Ticket[],
  });

  // Composición reactiva por snapshots: filtra localmente, sin nueva petición HTTP.
  protected readonly criticalTickets = resourceFromSnapshots<Ticket[]>(() => {
    const snap = this.ticketsResource.snapshot();
    if (snap.status === 'resolved' || snap.status === 'local') {
      return { status: snap.status, value: snap.value.filter((t) => t.severity === 'high') };
    }
    return snap as ResourceSnapshot<Ticket[]>;
  });

  protected selectClient(id: number): void {
    this.selectedClientId.set(id);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES (RxJS) — el mismo flujo encadenado a mano:
//
//   private readonly clientId$ = new BehaviorSubject<number | null>(null);
//   readonly criticals$ = this.clientId$.pipe(
//     filter(Boolean),
//     switchMap((id) => this.http.get<Client>(`/api/clients/${id}`)),  // cancela anterior
//     switchMap((client) => this.http.get<Ticket[]>(`/api/tickets?clientId=${client.id}`)),
//     map((tickets) => tickets.filter((t) => t.severity === 'high')),
//     catchError(() => of([])),
//   );
//   // + | async en el template, manejo manual de loading/error, fugas si no te desuscribís.
//
// VARIANTE REAL CON httpResource (PDF, Cap. 3) — pegándole a una API de verdad:
//
//   clientResource = httpResource<Client>(() => `/api/clients/${this.selectedClientId()}`);
//   ticketsResource = httpResource<Ticket[]>((ctx) => {
//     const client = ctx.chain(this.clientResource);
//     return `/api/tickets?clientId=${client.id}`;     // aborta la request previa en vuelo
//   });
// ─────────────────────────────────────────────────────────────────────────────
