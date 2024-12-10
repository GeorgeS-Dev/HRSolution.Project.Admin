import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SyncingLineChartService } from './syncing-line-chart.service';
import { SyncingLineChart2Service } from './syncing-line-chart2.service';
import { SyncingLineChart3Service } from './syncing-line-chart3.service';

@Component({
    selector: 'app-syncing-line-chart',
    standalone: true,
    imports: [RouterLink, MatCardModule],
    templateUrl: './syncing-line-chart.component.html',
    styleUrl: './syncing-line-chart.component.scss'
})
export class SyncingLineChartComponent {

    constructor(
        private syncingLineChartService: SyncingLineChartService,
        private syncingLineChart2Service: SyncingLineChart2Service,
        private syncingLineChart3Service: SyncingLineChart3Service
    ) {}

    ngOnInit(): void {
        this.syncingLineChartService.loadChart();
        this.syncingLineChart2Service.loadChart();
        this.syncingLineChart3Service.loadChart();
    }

}