import { Routes } from '@angular/router';

/**
 * Lazy loading por feature (CLAUDE.md: "Implement lazy loading for feature routes").
 * Cada ruta carga su componente bajo demanda con `loadComponent`, generando un
 * chunk independiente por capítulo.
 */
export const routes: Routes = [
  {
    path: 'demo',
    children: [
      {
        path: 'zoneless',
        title: 'Zoneless + OnPush',
        loadComponent: () =>
          import('./features/zoneless/zoneless').then((m) => m.ZonelessDemo),
      },
      {
        path: 'selectorless',
        title: 'Selectorless',
        loadComponent: () =>
          import('./features/selectorless/selectorless').then((m) => m.SelectorlessDemo),
      },
      {
        path: 'resource-api',
        title: 'Resource API',
        loadComponent: () =>
          import('./features/resource-api/resource-api').then((m) => m.ResourceApiDemo),
      },
      {
        path: 'signal-forms',
        title: 'Signal Forms',
        loadComponent: () =>
          import('./features/signal-forms/signal-forms').then((m) => m.SignalFormsDemo),
      },
      {
        path: 'modern-di',
        title: 'DI Moderna',
        loadComponent: () =>
          import('./features/modern-di/modern-di').then((m) => m.ModernDiDemo),
      },
      {
        path: 'router',
        title: 'Router Inteligente',
        loadComponent: () => import('./features/router/router-demo').then((m) => m.RouterDemo),
        // Hijo anidado: hereda los params del padre gracias a paramsInheritanceStrategy: 'always'
        children: [
          {
            path: ':studentId',
            loadComponent: () =>
              import('./features/router/student-dashboard').then((m) => m.StudentDashboard),
          },
        ],
      },
      {
        path: 'template-syntax',
        title: 'Sintaxis de Plantilla',
        loadComponent: () =>
          import('./features/template-syntax/template-syntax').then((m) => m.TemplateSyntaxDemo),
      },
      {
        path: 'aria-webmcp',
        title: 'Accesibilidad + WebMCP',
        loadComponent: () =>
          import('./features/aria-webmcp/aria-webmcp').then((m) => m.AriaWebmcpDemo),
      },
      {
        path: 'testing',
        title: 'Testing con Vitest',
        loadComponent: () =>
          import('./features/testing/testing-demo').then((m) => m.TestingDemo),
      },
      {
        path: 'content-plan',
        title: 'Plan de Contenido',
        loadComponent: () =>
          import('./features/content-plan/content-plan').then((m) => m.ContentPlanDemo),
      },
      { path: '', redirectTo: 'zoneless', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'demo/zoneless', pathMatch: 'full' },
];
