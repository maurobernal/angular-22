import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FEATURES } from './features';

/**
 * Shell de la aplicación: menú lateral accesible con las 10 demos + <router-outlet>.
 *
 * Accesibilidad (CLAUDE.md / WCAG AA):
 *  - <nav aria-label> + lista semántica.
 *  - "Skip link" para saltar al contenido principal.
 *  - routerLinkActive marca la demo actual con aria-current="page".
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-700 focus:px-4 focus:py-2 focus:text-white"
    >
      Saltar al contenido
    </a>

    <div class="flex min-h-dvh bg-slate-50 text-slate-900">
      <nav
        aria-label="Demos de Angular 22"
        class="w-72 shrink-0 border-r border-slate-200 bg-white"
      >
        <div class="border-b border-slate-200 p-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Manual Técnico
          </p>
          <h1 class="mt-1 text-lg font-bold leading-tight">
            Angular 22
            <span class="block text-sm font-normal text-slate-500">
              Era Signals-First &amp; Zoneless
            </span>
          </h1>
        </div>

        <ul class="space-y-1 p-3">
          @for (feature of features; track feature.path) {
            <li>
              <a
                [routerLink]="['/demo', feature.path]"
                routerLinkActive="bg-violet-50 text-violet-800 ring-1 ring-violet-200"
                #rla="routerLinkActive"
                [attr.aria-current]="rla.isActive ? 'page' : null"
                class="flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                <span
                  aria-hidden="true"
                  class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-slate-100 text-base"
                >
                  {{ feature.icon }}
                </span>
                <span class="min-w-0">
                  <span class="block font-medium">
                    {{ feature.chapter }}. {{ feature.title }}
                  </span>
                  <span class="block truncate text-xs text-slate-500">
                    {{ feature.concept }}
                  </span>
                </span>
              </a>
            </li>
          }
        </ul>
      </nav>

      <main id="main-content" tabindex="-1" class="min-w-0 flex-1 p-6 lg:p-10">
        <router-outlet />
      </main>
    </div>
  `,
})
export class App {
  protected readonly features = FEATURES;
}
