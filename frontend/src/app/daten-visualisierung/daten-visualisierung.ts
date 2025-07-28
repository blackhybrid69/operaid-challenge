/*
import { Component, OnInit } from '@angular/core';
import { Websocket } from '../websocket';
import { Chart, registerables } from 'chart.js';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-daten-visualisierung',
  templateUrl: './daten-visualisierung.html',
  styleUrls: ['./daten-visualisierung.css'],
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatCardModule, MatTableModule, FormsModule]
})
export class DatenVisualisierung implements OnInit {
  // Daten
  aggregatedData: { [key: string]: any } = {};
  filteredData: any[] = [];
  allMachines: string[] = [];
  allScrapIndices: number[] = [];
  selectedMachines: string[] = [];
  selectedScrapIndices: number[] = [];
  displayedColumns = ['machineId', 'scrapIndex', 'sumLast60s', 'avgLast60s', 'timestamp'];
  
  // Chart
  chart?: Chart;
  chartTypes = ['bar', 'line', 'pie'];
  selectedChartType: string = 'bar';

  constructor(private websocketService: Websocket) {}

  ngOnInit() {
    this.initChart();
    this.websocketService.connect();
    this.websocketService.dataStream.subscribe(data => {
      const key = `${data.machineId}-${data.scrapIndex}`;
      this.aggregatedData[key] = data;

      if (!this.allMachines.includes(data.machineId)) {
        this.allMachines.push(data.machineId);
      }
      if (!this.allScrapIndices.includes(data.scrapIndex)) {
        this.allScrapIndices.push(data.scrapIndex);
      }

      this.applyFilters();
    });
  }

  initChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: this.selectedChartType as any,
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  applyFilters() {
    // Filtere Daten
    this.filteredData = Object.values(this.aggregatedData).filter(item => {
      const machineMatch = this.selectedMachines.length === 0 || 
                         this.selectedMachines.includes(item.machineId);
      const indexMatch = this.selectedScrapIndices.length === 0 || 
                       this.selectedScrapIndices.includes(item.scrapIndex);
      return machineMatch && indexMatch;
    });

    this.updateChart();
  }

  updateChart() {
    if (!this.chart) return;

    // Zerstöre alten Chart
    this.chart.destroy();

    // Neuen Chart erstellen
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: this.selectedChartType as any,
      data: {
        labels: this.filteredData.map(d => `${d.machineId}-${d.scrapIndex}`),
        datasets: [
          {
            label: 'Summe (60s)',
            data: this.filteredData.map(d => d.sumLast60s),
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          },
          {
            label: 'Durchschnitt (60s)',
            data: this.filteredData.map(d => d.avgLast60s),
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
          }
        ]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  onChartTypeChange() {
    this.updateChart();
  }

  onMachineFilterChange(event: any) {
    this.selectedMachines = event.value;
    this.applyFilters();
  }

  onScrapIndexFilterChange(event: any) {
    this.selectedScrapIndices = event.value;
    this.applyFilters();
  }
}

*/

import { Component, OnInit } from '@angular/core';
import { Websocket } from '../websocket';
import { Chart, registerables } from 'chart.js';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-daten-visualisierung',
  templateUrl: './daten-visualisierung.html',
  styleUrls: ['./daten-visualisierung.css'],
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatCardModule, MatTableModule, FormsModule]
})
export class DatenVisualisierung implements OnInit {
  // Daten
  aggregatedData: { [key: string]: any } = {};
  filteredData: any[] = [];
  allMachines: string[] = [];
  allScrapIndices: number[] = [];
  selectedMachines: string[] = [];
  selectedScrapIndices: number[] = [];
  displayedColumns: string[] = ['machineId', 'scrapIndex', 'sumLast60s', 'avgLast60s', 'timestamp'];
  
  // Chart
  chart?: Chart;
  chartTypes = ['bar', 'line', 'pie'];
  selectedChartType = 'bar';
  private machineColors: {[key: string]: {avg: string, sum: string}} = {};

  constructor(private websocketService: Websocket) {}

  ngOnInit() {
    this.initChart();
    this.websocketService.connect();
    this.websocketService.dataStream.subscribe(data => {
      this.processIncomingData(data);
    });
  }

  private processIncomingData(newData: any) {
    const key = `${newData.machineId}-${newData.scrapIndex}`;
    this.aggregatedData[key] = newData;

    // Maschinen und Indices aktualisieren
    if (!this.allMachines.includes(newData.machineId)) {
      this.allMachines.push(newData.machineId);
      this.generateMachineColor(newData.machineId);
    }
    if (!this.allScrapIndices.includes(newData.scrapIndex)) {
      this.allScrapIndices.push(newData.scrapIndex);
    }

    this.applyFilters();
  }

  private generateMachineColor(machineId: string) {
    const hue = Math.floor(Math.random() * 360);
    this.machineColors[machineId] = {
      avg: `hsla(${hue}, 70%, 60%, 0.7)`,
      sum: `hsla(${(hue + 30) % 360}, 80%, 50%, 0.7)`
    };
  }

  applyFilters() {
    this.filteredData = Object.values(this.aggregatedData).filter(item => {
      const machineMatch = this.selectedMachines.length === 0 || 
                         this.selectedMachines.includes(item.machineId);
      const indexMatch = this.selectedScrapIndices.length === 0 || 
                       this.selectedScrapIndices.includes(item.scrapIndex);
      return machineMatch && indexMatch;
    });
    this.updateChart();
  }

  private initChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: this.selectedChartType as any,
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  updateChart() {
    if (!this.chart) return;

    this.chart.data = {
      labels: this.filteredData.map(d => `${d.machineId}-${d.scrapIndex}`),
      datasets: [
        {
          label: 'Durchschnitt (60s)',
          data: this.filteredData.map(d => d.avgLast60s),
          backgroundColor: this.filteredData.map(d => this.machineColors[d.machineId].avg),
          borderColor: '#ffffff',
          borderWidth: 1
        },
        {
          label: 'Summe (60s)',
          data: this.filteredData.map(d => d.sumLast60s),
          backgroundColor: this.filteredData.map(d => this.machineColors[d.machineId].sum),
          borderColor: '#ffffff',
          borderWidth: 1
        }
      ]
    };
    this.chart.update();
  }

  // Event-Handler für Filteränderungen
  onMachineFilterChange(event: any) {
    this.selectedMachines = event.value;
    this.applyFilters();
  }

  onScrapIndexFilterChange(event: any) {
    this.selectedScrapIndices = event.value;
    this.applyFilters();
  }

  onChartTypeChange() {
    if (!this.chart) return;
    this.chart.destroy();
    this.initChart();
    this.updateChart();
  }
}