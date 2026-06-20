import { Directive, ElementRef, effect, inject, input } from '@angular/core';

/**
 * CAP. 2 — Directiva de tooltip.
 *
 * En la era selectorless la directiva no necesita selector de atributo y se usa
 * con `@` antepuesto al nombre de la clase en la plantilla:
 *   <button @Tooltip="'Añadir al carrito'">Añadir</button>
 *
 * Mientras la sintaxis selectorless está en preview, exponemos un selector de
 * atributo clásico para que funcione hoy: `[appTooltip]`.
 */
@Directive({
  selector: '[appTooltip]',
})
export class Tooltip {
  readonly text = input.required<string>({ alias: 'appTooltip' });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // effect: cada vez que cambia el texto, sincroniza el atributo title del host.
    effect(() => {
      this.host.nativeElement.setAttribute('title', this.text());
    });
  }
}
