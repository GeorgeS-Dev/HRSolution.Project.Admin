import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { OrganicSessionsService } from './organic-sessions.service';

@Component({
    selector: 'app-organic-sessions',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './organic-sessions.component.html',
    styleUrl: './organic-sessions.component.scss'
})
export class OrganicSessionsComponent {

    constructor(
        private organicSessionsService: OrganicSessionsService
    ) {}

    ngOnInit(): void {
        this.organicSessionsService.loadChart();
    }

}