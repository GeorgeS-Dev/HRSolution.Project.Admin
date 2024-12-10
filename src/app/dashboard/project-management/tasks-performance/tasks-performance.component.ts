import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TasksPerformanceService } from './tasks-performance.service';

@Component({
    selector: 'app-tasks-performance',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './tasks-performance.component.html',
    styleUrl: './tasks-performance.component.scss'
})
export class TasksPerformanceComponent {

    constructor(
        private tasksPerformanceService: TasksPerformanceService
    ) {}

    ngOnInit(): void {
        this.tasksPerformanceService.loadChart();
    }

}