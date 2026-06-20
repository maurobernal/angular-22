import { Service } from '@angular/core';

export interface Transaction {
  id: number;
  amount: number;
}

/**
 * CAP. 5 — Servicio "pesado" de exportación, cargado de forma perezosa.
 *
 * @Service() lo registra automáticamente como singleton raíz (autoProvided: true
 * por defecto), sin la sintaxis repetitiva de @Injectable({ providedIn: 'root' }).
 *
 * Para limitar el ciclo de vida a un componente concreto:  @Service({ autoProvided: false })
 */
@Service()
export class ExcelReportExporter {
  /** Simula la generación de un archivo (en producción: librería pesada + descarga). */
  exportData(rows: readonly Transaction[]): string {
    const header = 'id,amount';
    const body = rows.map((r) => `${r.id},${r.amount}`).join('\n');
    return `${header}\n${body}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES (Angular ≤ 21):
//
//   @Injectable({ providedIn: 'root' })   // sintaxis repetitiva en cada servicio
//   export class ExcelReportExporter {
//     constructor(private http: HttpClient) {}   // inyección por constructor
//   }
//
// AHORA: @Service() + inject() funcional.
// ─────────────────────────────────────────────────────────────────────────────
