/**
 * Metadatos de las 10 demos del video "Angular 22: Era Signals-First y Zoneless".
 * Una sola fuente de verdad: la usan tanto el menú (shell) como las rutas lazy.
 */
export interface FeatureMeta {
  /** Segmento de ruta, ej. 'zoneless' -> /demo/zoneless */
  readonly path: string;
  /** Número de capítulo del manual (1..10) */
  readonly chapter: number;
  /** Título corto para el menú */
  readonly title: string;
  /** Concepto principal que desarrolla la demo */
  readonly concept: string;
  /** Emoji decorativo (aria-hidden en el menú) */
  readonly icon: string;
}

export const FEATURES: readonly FeatureMeta[] = [
  {
    path: 'zoneless',
    chapter: 1,
    title: 'Zoneless + OnPush',
    concept: 'Detección de cambios sin zone.js, signals y renderizado quirúrgico.',
    icon: '⚡',
  },
  {
    path: 'selectorless',
    chapter: 2,
    title: 'Selectorless',
    concept: 'Componentes y directivas sin selector, imports implícitos por ESM.',
    icon: '🏷️',
  },
  {
    path: 'resource-api',
    chapter: 3,
    title: 'Resource API',
    concept: 'resource/httpResource, chain() y resourceFromSnapshots.',
    icon: '🔄',
  },
  {
    path: 'signal-forms',
    chapter: 4,
    title: 'Signal Forms',
    concept: 'form(), validadores, validateHttp, debounce y getError().',
    icon: '📝',
  },
  {
    path: 'modern-di',
    chapter: 5,
    title: 'DI Moderna',
    concept: '@Service(), inject() e injectAsync() con prefetch onIdle.',
    icon: '💉',
  },
  {
    path: 'router',
    chapter: 6,
    title: 'Router Inteligente',
    concept: 'browserUrl, paramsInheritanceStrategy y component input binding.',
    icon: '🧭',
  },
  {
    path: 'template-syntax',
    chapter: 7,
    title: 'Sintaxis de Plantilla',
    concept: '@let, spread, arrow functions inline y @defer.',
    icon: '🧩',
  },
  {
    path: 'aria-webmcp',
    chapter: 8,
    title: 'Accesibilidad + WebMCP',
    concept: 'Patrones ARIA accesibles y herramientas WebMCP para IA.',
    icon: '♿',
  },
  {
    path: 'testing',
    chapter: 9,
    title: 'Testing con Vitest',
    concept: 'Vitest, TestBed.getLastFixture() y PendingTasks.',
    icon: '🧪',
  },
  {
    path: 'content-plan',
    chapter: 10,
    title: 'Plan de Contenido',
    concept: 'Estructura para blog y guion minuto a minuto para YouTube.',
    icon: '🎬',
  },
] as const;
