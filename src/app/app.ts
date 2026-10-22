import { Component } from '@angular/core';
import { PrimerComponente } from './components/primer-componente/primer-componente';

@Component({
  imports: [PrimerComponente],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
