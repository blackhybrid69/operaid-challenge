import { Component } from '@angular/core';
import { DatenVisualisierung } from './daten-visualisierung/daten-visualisierung';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCardModule,
    DatenVisualisierung
  ],
  template: `
    <mat-card class="app-container">
      <app-daten-visualisierung></app-daten-visualisierung>
    </mat-card>
  `,
  styles: [`
    .app-container {
      margin: 16px;
      padding: 16px;
    }
  `]
})
export class App {}
