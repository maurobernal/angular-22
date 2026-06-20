import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Ruta paramétrica del demo de router: render en servidor (no prerender),
    // así no necesita getPrerenderParams para los IDs de estudiante.
    path: 'demo/router/:studentId',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
