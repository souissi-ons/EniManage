import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { EventsService } from 'src/app/services/events.service';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

interface EventStats {
  moyenneGlobale: number;
  moyennePertinence: number;
  moyenneOrganisation: number;
  moyenneAmbiance: number;
  tauxRecommandation: number;
  totalFeedbacks: number;
}

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.component.html',
  standalone: true,
  imports: [NgChartsModule, CommonModule], // Ajouter NgChartsModule ici
  styleUrls: ['./event-stats.component.css'],
})
export class EventStatsComponent implements OnInit {
  eventId: number = 1;
  stats: EventStats | null = null;

  // Bar chart for rating distribution
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y?.toFixed(1)}/5`,
        },
      },
    },
  };
  public globalRatingChartData: ChartData<'bar'> = {
    labels: ['Global', 'Relevance', 'Organization', 'Atmosphere'],
    datasets: [
      {
        data: [],
        backgroundColor: '#0d9488', // teal-600
        borderColor: '#0f766e', // teal-700
        borderWidth: 1,
      },
    ],
  };

  // Radar chart for rating comparison
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  public radarChartData: ChartData<'radar'> = {
    labels: ['Global', 'Relevance', 'Organization', 'Atmosphere'],
    datasets: [
      {
        data: [],
        label: 'Average Ratings',
        backgroundColor: 'rgba(13, 148, 136, 0.2)', // teal-600 with opacity
        borderColor: '#0d9488', // teal-600
        pointBackgroundColor: '#0d9488',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0d9488',
      },
    ],
  };

  // Doughnut chart for recommendation
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = (context.raw as number) || 0;
            const total = (context.dataset.data as number[]).reduce(
              (a, b) => a + b,
              0
            );
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };
  public recommendationChartData: ChartData<'doughnut'> = {
    labels: ['Recommended', 'Not Recommended'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#0d9488', '#e5e7eb'], // teal-600 and gray-200
        hoverBackgroundColor: ['#0f766e', '#d1d5db'], // teal-700 and gray-300
      },
    ],
  };

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.eventsService.getEventStats(this.eventId).subscribe({
      next: (stats: EventStats) => {
        this.stats = stats;
        this.updateCharts();
      },
      error: (err) => console.error('Error loading stats:', err),
    });
  }

  updateCharts(): void {
    if (!this.stats) return;

    // Bar chart data
    this.globalRatingChartData.datasets[0].data = [
      this.stats.moyenneGlobale || 0,
      this.stats.moyennePertinence || 0,
      this.stats.moyenneOrganisation || 0,
      this.stats.moyenneAmbiance || 0,
    ];

    // Radar chart data
    this.radarChartData.datasets[0].data = [
      this.stats.moyenneGlobale || 0,
      this.stats.moyennePertinence || 0,
      this.stats.moyenneOrganisation || 0,
      this.stats.moyenneAmbiance || 0,
    ];

    // Doughnut chart data
    const recommended = this.stats.tauxRecommandation || 0;
    const notRecommended = (this.stats.totalFeedbacks || 0) - recommended;
    this.recommendationChartData.datasets[0].data = [
      recommended,
      notRecommended,
    ];
  }
}
