import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { VisitsByWeekService } from './visits-by-week.service';

@Component({
    selector: 'app-visits-by-week',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './visits-by-week.component.html',
    styleUrl: './visits-by-week.component.scss'
})
export class VisitsByWeekComponent {

    constructor(
        private visitsByWeekService: VisitsByWeekService
    ) {}

    ngOnInit(): void {
        this.visitsByWeekService.loadChart();
    }

}