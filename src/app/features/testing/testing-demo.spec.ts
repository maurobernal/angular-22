import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CalculatorCmp } from './testing-demo';

describe('CalculatorCmp', () => {
  it('renderiza el total con getLastFixture()', () => {
    const fixture = TestBed.createComponent(CalculatorCmp);
    fixture.detectChanges();

    // Nuevo en v22: recupera el último fixture creado (reemplaza a getFixture).
    const active = TestBed.getLastFixture<CalculatorCmp>();
    const el = active.nativeElement as HTMLElement;

    expect(el.querySelector('span')?.textContent).toContain('Resultado: 100');
  });
});
