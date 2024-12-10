import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { SalesForecastService } from './sales-forecast.service';

@Component({
    selector: 'app-sales-forecast',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './sales-forecast.component.html',
    styleUrl: './sales-forecast.component.scss'
})
export class SalesForecastComponent {

    constructor(
        private salesForecastService: SalesForecastService
    ) {}

    ngOnInit(): void {
        this.salesForecastService.loadChart();
    }

}