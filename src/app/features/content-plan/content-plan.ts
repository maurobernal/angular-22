import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoPage } from '../../shared/demo-page';

interface ScriptBlock {
  time: string;
  title: string;
  detail: string;
}

/**
 * CAP. 10 — Estructura de preparación para blog técnico y video de YouTube.
 * Página presentacional (slide de cierre del video).
 */
@Component({
  selector: 'app-content-plan-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage],
  template: `
    <demo-page
      [chapter]="10"
      title="Plan de Contenido"
      concept="Cómo empaquetar estas 10 demos para blog y un guion minuto a minuto para YouTube."
    >
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">Paquetes para el blog</h3>
        <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          @for (item of blogPackages; track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">Guion para YouTube (15 min)</h3>
        <table class="mt-3 w-full text-left text-sm">
          <caption class="sr-only">Guion minuto a minuto del video</caption>
          <thead>
            <tr class="border-b border-slate-200 text-slate-500">
              <th scope="col" class="py-2 pr-4 font-medium">Minuto</th>
              <th scope="col" class="py-2 pr-4 font-medium">Bloque</th>
              <th scope="col" class="py-2 font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            @for (block of script; track block.time) {
              <tr class="border-b border-slate-100 align-top">
                <td class="py-2 pr-4 font-mono text-xs tabular-nums">{{ block.time }}</td>
                <td class="py-2 pr-4 font-medium">{{ block.title }}</td>
                <td class="py-2 text-slate-600">{{ block.detail }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </demo-page>
  `,
})
export class ContentPlanDemo {
  protected readonly blogPackages = [
    'Introducción al cambio de paradigma (Zoneless + Signals).',
    'Guías de código detalladas (copy-paste directo para desarrolladores).',
    'Tablas comparativas y enlaces de interoperabilidad con librerías empresariales.',
  ];

  protected readonly script: ScriptBlock[] = [
    {
      time: '00:00–02:00',
      title: 'Gancho e historia',
      detail: 'App pesada actualizándose; cómo Angular 22 deshabilita zone.js.',
    },
    {
      time: '02:01–05:30',
      title: 'Live-coding Selectorless',
      detail: 'Componente desde cero, eliminar selector e imports.',
    },
    {
      time: '05:31–09:15',
      title: 'Resource API',
      detail: 'chain(), snapshots y simulación de fallos del recurso origen.',
    },
    {
      time: '09:16–12:45',
      title: 'Signal Forms + Zod',
      detail: 'Sintaxis simplificada y getError() para mensajes dinámicos.',
    },
    {
      time: '12:46–15:00',
      title: 'Cierre y hoja de ruta',
      detail: 'Comandos de actualización y futuro con agentes WebMCP.',
    },
  ];
}
