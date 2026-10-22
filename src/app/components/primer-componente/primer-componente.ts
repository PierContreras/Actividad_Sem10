import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import Swal from 'sweetalert2';

interface Registro {
  id: string;
  nombre: string;
  apellido: string;
  edad: string;
  correo: string;
  ciudad: string;
}

type DatosRegistro = Omit<Registro, 'id'>;
type CampoRegistro = keyof DatosRegistro;

const ALMACENAMIENTO = 'registro-personas';

@Component({
  selector: 'app-primer-componente',
  templateUrl: './primer-componente.html',
  styleUrl: './primer-componente.css',
})
export class PrimerComponente {
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly registros = signal<Registro[]>([]);

  protected readonly datos = signal<DatosRegistro>(this.datosVacios());

  constructor() {
    this.cargarRegistros();
  }

  protected actualizarCampo(campo: CampoRegistro, evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.datos.update((actuales) => ({ ...actuales, [campo]: valor }));
  }

  protected guardar(evento: SubmitEvent): void {
    evento.preventDefault();
    const datos = this.datos();
    const edad = Number(datos.edad);

    if (Object.values(datos).some((valor) => !valor.trim())) {
      void Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Completa los cinco campos antes de guardar.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#246b57',
      });
      return;
    }

    const correo = (evento.currentTarget as HTMLFormElement).elements.namedItem('correo');
    if (correo instanceof HTMLInputElement && correo.validity.typeMismatch) {
      void Swal.fire({
        icon: 'warning',
        title: 'Revisa el correo',
        text: 'Escribe una dirección de correo electrónico válida.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#246b57',
      });
      return;
    }

    if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
      void Swal.fire({
        icon: 'warning',
        title: 'Revisa la edad',
        text: 'La edad debe ser un número entero entre 1 y 120.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#246b57',
      });
      return;
    }

    const nuevosRegistros = [
      ...this.registros(),
      { ...datos, id: `${Date.now()}-${Math.random()}` },
    ];

    if (!this.persistirRegistros(nuevosRegistros)) {
      return;
    }

    this.registros.set(nuevosRegistros);
    this.datos.set(this.datosVacios());
    void Swal.fire({
      icon: 'success',
      title: 'Registro guardado',
      text: 'Los datos se guardaron correctamente en este dispositivo.',
      timer: 1800,
      showConfirmButton: false,
    });
  }

  private cargarRegistros(): void {
    if (!this.esNavegador) {
      return;
    }

    try {
      const guardados = localStorage.getItem(ALMACENAMIENTO);
      if (!guardados) {
        return;
      }

      const registros: unknown = JSON.parse(guardados);
      if (!Array.isArray(registros) || !registros.every((registro) => this.esRegistro(registro))) {
        throw new Error('El contenido guardado no tiene el formato esperado.');
      }
      this.registros.set(registros);
    } catch (error) {
      console.error('No se pudieron cargar los registros guardados.', error);
      void Swal.fire({
        icon: 'error',
        title: 'No se pudieron cargar los registros',
        text: 'Los datos guardados están dañados o el navegador no permite acceder a ellos.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#246b57',
      });
    }
  }

  private persistirRegistros(registros: Registro[]): boolean {
    if (!this.esNavegador) {
      return false;
    }

    try {
      localStorage.setItem(ALMACENAMIENTO, JSON.stringify(registros));
      return true;
    } catch (error) {
      console.error('No se pudieron guardar los registros.', error);
      void Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text: 'Comprueba el espacio disponible y los permisos de almacenamiento del navegador.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#246b57',
      });
      return false;
    }
  }

  private esRegistro(valor: unknown): valor is Registro {
    if (typeof valor !== 'object' || valor === null) {
      return false;
    }
    const registro = valor as Record<string, unknown>;
    return ['id', 'nombre', 'apellido', 'edad', 'correo', 'ciudad'].every(
      (campo) => typeof registro[campo] === 'string',
    );
  }

  private datosVacios(): DatosRegistro {
    return { nombre: '', apellido: '', edad: '', correo: '', ciudad: '' };
  }
}
