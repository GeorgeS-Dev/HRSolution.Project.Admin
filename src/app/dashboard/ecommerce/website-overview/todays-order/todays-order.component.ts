import { Component } from '@angular/core';
import { TodaysOrderService } from './todays-order.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-todays-order',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './todays-order.component.html',
    styleUrl: './todays-order.component.scss'
})
export class TodaysOrderComponent {

    constructor(
        private todaysOrderService: TodaysOrderService
    ) {}

    ngOnInit(): void {
        this.todaysOrderService.loadChart();
    }

}