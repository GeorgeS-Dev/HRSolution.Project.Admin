import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TotalGrowthService } from './total-growth.service';

@Component({
    selector: 'app-total-growth',
    standalone: true,
    imports: [RouterLink, MatCardModule],
    templateUrl: './total-growth.component.html',
    styleUrl: './total-growth.component.scss'
})
export class TotalGrowthComponent {

    constructor(
        private totalGrowthService: TotalGrowthService
    ) {}

    ngOnInit(): void {
        this.totalGrowthService.loadChart();
    }

}