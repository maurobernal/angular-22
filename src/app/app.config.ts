import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';

// ───────────────────────────────────────────────────────────────────────────
// CAP. 1 — Arranque Zoneless (Angular 22).
//
// ANTES (hasta v17, con zone.js):
//   El arranque dependía de zone.js parcheando las APIs asíncronas del navegador.
//   No hacía falta proveer nada: zone.js se incluía en "polyfills" y disparaba la
//   detección de cambios globalmente tras cada evento/timer/promesa.
//
//   // angular.json -> "polyfills": ["zone.js"]
//   bootstrapApplication(App);
//
// PDF (nombre experimental antiguo):
//   provideExperimentalZonelessChangeDetection()  // renombrado a la versión estable
//
// AHORA (Angular 22): zoneless estable. Sin zone.js en dependencias.
// ───────────────────────────────────────────────────────────────────────────
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // CAP. 6 — el binding de inputs desde la ruta y la herencia de params 'always'
      // son parte del enrutador inteligente.
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideClientHydration(),
  ],
};
