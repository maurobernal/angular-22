import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  debounce,
  email,
  form,
  FormField,
  minDate,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { DemoPage } from '../../shared/demo-page';

interface AccountModel {
  username: string;
  password: string;
  birthDate: Date;
  email: string;
}

/**
 * CAP. 4 — Signal Forms (`@angular/forms/signals`).
 *
 * Caso: alta de cuenta empresarial. El estado del formulario es un signal y los
 * validadores se declaran en una función de esquema. El template lee estado y
 * errores tipados con getError(), touched(), invalid().
 */
@Component({
  selector: 'app-signal-forms-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoPage, FormField],
  template: `
    <demo-page
      [chapter]="4"
      title="Signal Forms"
      concept="form() crea un árbol reactivo; los validadores viven en el esquema; el template usa [formField], getError() y estado tipado."
    >
      <form
        (submit)="submitForm($event)"
        class="max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label for="username" class="block text-sm font-medium">Usuario</label>
          <input
            id="username"
            [formField]="accountForm.username"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-600"
          />
          @let username = accountForm.username();
          @if (username.touched() && username.invalid()) {
            @if (username.getError('required')) {
              <p class="mt-1 text-xs text-red-600">El usuario es obligatorio.</p>
            } @else if (username.getError('minLength'); as err) {
              <p class="mt-1 text-xs text-red-600">
                Se requieren mínimo {{ err.minLength }} caracteres.
              </p>
            }
          }
        </div>

        <div>
          <label for="password" class="block text-sm font-medium">Contraseña</label>
          <input
            id="password"
            type="password"
            [formField]="accountForm.password"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-600"
          />
          <p class="mt-1 text-xs text-slate-400">Validación con debounce al perder el foco.</p>
        </div>

        <div>
          <label for="birthDate" class="block text-sm font-medium">Fecha de constitución</label>
          <input
            id="birthDate"
            type="date"
            [formField]="accountForm.birthDate"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-600"
          />
          @let birth = accountForm.birthDate();
          @if (birth.touched() && birth.getError('minDate')) {
            <p class="mt-1 text-xs text-red-600">
              La fecha debe ser posterior al 01/01/1990.
            </p>
          }
        </div>

        <div>
          <label for="email" class="block text-sm font-medium">Email corporativo</label>
          <input
            id="email"
            type="email"
            [formField]="accountForm.email"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-600"
          />
          @let emailField = accountForm.email();
          @if (emailField.touched() && emailField.getError('email')) {
            <p class="mt-1 text-xs text-red-600">El correo no tiene un formato válido.</p>
          }
        </div>

        <button
          type="submit"
          [disabled]="accountForm().invalid()"
          class="w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Crear cuenta
        </button>

        @if (lastSubmitted(); as payload) {
          <p role="status" class="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Enviado: {{ payload }}
          </p>
        }
      </form>
    </demo-page>
  `,
})
export class SignalFormsDemo {
  protected readonly lastSubmitted = signal<string | null>(null);

  protected readonly accountForm = form(
    signal<AccountModel>({
      username: '',
      password: '',
      birthDate: new Date('2000-01-01'),
      email: '',
    }),
    (path) => {
      required(path.username);
      minLength(path.username, 5);
      minDate(path.birthDate, new Date('1990-01-01'));
      email(path.email);
      // Retrasa la emisión del valor hasta perder el foco (evita validar en cada tecla).
      debounce(path.password, 'blur');

      // Validación asíncrona contra un endpoint (requiere backend):
      // validateHttp(path.email, {
      //   request: (ctx) => `/api/auth/check-email?value=${ctx.value()}`,
      //   onSuccess: (taken) => (taken ? { kind: 'email', message: 'Ya registrado' } : null),
      //   onError: () => ({ kind: 'email', message: 'No se pudo validar' }),
      //   debounce: 500,
      // });

      // Esquema externo Zod/Valibot (requiere instalar zod):
      // validateStandardSchema(path, AccountSchema);
    },
  );

  protected async submitForm(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.accountForm, async (form) => {
      this.lastSubmitted.set(JSON.stringify(form().value()));
      // Acá irían las peticiones de guardado.
      return undefined;
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTES (Reactive Forms clásicos):
//
//   form = new FormGroup({
//     username: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
//     email: new FormControl('', { validators: [Validators.email] }),
//   });
//   // Template:
//   <input [formControl]="form.controls.username">
//   <div *ngIf="form.controls.username.touched && form.controls.username.errors?.minlength">
//     Mínimo {{ form.controls.username.errors?.minlength.requiredLength }}
//   </div>
//   // Sin tipado fuerte de errores, sin getError(), y el estado no son signals.
// ─────────────────────────────────────────────────────────────────────────────
