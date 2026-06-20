import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DemoPage } from '../../shared/demo-page';

/**
 * CAP. 6 — Enrutamiento inteligente y desacoplamiento de URLs.
 *
 * - browserUrl: muestra una URL estética en la barra del navegador mientras el
 *   enrutador resuelve internamente otra ruta parametrizada distinta.
 * - paramsInheritanceStrategy: 'always' + withComponentInputBinding (en app.config):
 *   los params llegan al hijo como input() sin configuración extra.
 */
@Component({
  selector: 'app-router-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage, RouterLink, RouterOutlet],
  template: `
    <demo-page
      [chapter]="6"
      title="Router Inteligente"
      concept="browserUrl desacopla la URL visible de la interna; los params se heredan e inyectan como input() en el hijo."
    >
      <nav aria-label="Estudiantes" class="flex flex-wrap gap-2">
        <a
          [routerLink]="['/demo/router', 4029]"
          class="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Estudiante 4029
        </a>
        <a
          [routerLink]="['/demo/router', 5510]"
          class="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Estudiante 5510
        </a>
        <button
          type="button"
          (click)="openWithPrettyUrl(4029)"
          class="rounded-md border border-violet-600 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
        >
          Abrir 4029 con URL estética
        </button>
      </nav>

      <p class="text-sm text-slate-500">
        URL en la barra:
        <code class="rounded bg-slate-100 px-1">{{ shownUrl() }}</code>
      </p>

      <!-- El hijo se renderiza acá y recibe :studentId como input() -->
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <router-outlet />
      </section>
    </demo-page>
  `,
})
export class RouterDemo {
  private readonly router = inject(Router);
  protected readonly shownUrl = signal('/demo/router');

  /**
   * Navega a la ruta técnica (/demo/router/4029) pero muestra una URL amigable
   * en la barra del navegador mediante `browserUrl`. El estado interno del router
   * (params, data) sigue correspondiendo a la ruta real.
   */
  protected openWithPrettyUrl(id: number): void {
    this.router.navigate(['/demo/router', id], {
      browserUrl: '/perfil-academico',
    });
    this.shownUrl.set('/perfil-academico');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF (Cap. 6) — proponía browserUrl como input del RouterLink:
//   <a [routerLink]="['/estudiantes', 4029, 'dashboard']" [browserUrl]="'/perfil-seo'">
//
// En este build estable browserUrl es parte de NavigationExtras / RedirectCommand,
// por eso lo usamos vía router.navigate(..., { browserUrl }) como arriba.
// ─────────────────────────────────────────────────────────────────────────────
