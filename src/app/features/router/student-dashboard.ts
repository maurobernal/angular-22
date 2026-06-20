import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * CAP. 6 — Componente hijo del enrutador.
 *
 * Gracias a withComponentInputBinding(), el parámetro de ruta `:studentId` se
 * enlaza automáticamente a este input(); no hace falta inyectar ActivatedRoute
 * ni navegar recursivamente a route.parent (paramsInheritanceStrategy: 'always').
 */
@Component({
  selector: 'app-student-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-4 rounded-lg bg-slate-50 p-4">
      <h4 class="font-medium">
        Ficha de Rendimiento Estudiantil (ID: {{ studentId() }})
      </h4>
      <p class="text-sm text-slate-600">Reporte consolidado de asistencia y calificaciones.</p>
    </div>
  `,
})
export class StudentDashboard {
  // El nombre del input coincide con el del parámetro de ruta -> binding automático.
  readonly studentId = input<string>();
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES — leer el parámetro manualmente (y subir a route.parent si estaba en el padre):
//
//   private readonly route = inject(ActivatedRoute);
//   studentId = this.route.snapshot.paramMap.get('studentId')
//             ?? this.route.parent?.snapshot.paramMap.get('studentId');
// ─────────────────────────────────────────────────────────────────────────────
