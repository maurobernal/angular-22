import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DemoPage } from '../../shared/demo-page';

/**
 * CAP. 9 — Evolución de las pruebas unitarias (Vitest + nuevas utilidades de TestBed).
 *
 * Este componente "Calculadora" es el sujeto de prueba; el spec real está en
 * `testing-demo.spec.ts` y usa Vitest + TestBed.getLastFixture().
 */
@Component({
  selector: 'app-calculator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>Resultado: {{ total() }}</span>`,
})
export class CalculatorCmp {
  readonly total = signal(100);
}

@Component({
  selector: 'app-testing-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage, CalculatorCmp],
  template: `
    <demo-page
      [chapter]="9"
      title="Testing con Vitest"
      concept="Vitest reemplaza a Karma/Jasmine; TestBed.getLastFixture() recupera el fixture actual y PendingTasks indica estabilidad."
    >
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">Componente bajo prueba</h3>
        <div class="mt-2 rounded-md bg-slate-50 p-3 text-sm">
          <app-calculator />
        </div>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold">Spec (Vitest)</h3>
        <pre class="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">{{ specSource }}</pre>
      </section>
    </demo-page>
  `,
})
export class TestingDemo {
  // Se muestra el mismo código que vive en testing-demo.spec.ts.
  protected readonly specSource = `import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CalculatorCmp } from './testing-demo';

describe('CalculatorCmp', () => {
  it('renderiza el total con getLastFixture()', () => {
    const fixture = TestBed.createComponent(CalculatorCmp);
    fixture.detectChanges();

    // Nuevo en v22: recupera el último fixture creado.
    const active = TestBed.getLastFixture<CalculatorCmp>();
    const el = active.nativeElement as HTMLElement;

    expect(el.querySelector('span')?.textContent).toContain('Resultado: 100');
  });
});`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES (Karma + Jasmine):
//   import { TestBed } from '@angular/core/testing';
//   describe('CalculatorCmp', () => {
//     it('...', () => {
//       const fixture = TestBed.createComponent(CalculatorCmp);  // sin getLastFixture()
//       fixture.detectChanges();
//       expect(fixture.nativeElement.textContent).toContain('100');
//     });
//   });
//   // Ejecutado por Karma en un navegador real; Vitest corre más rápido en Node/jsdom.
// ─────────────────────────────────────────────────────────────────────────────
