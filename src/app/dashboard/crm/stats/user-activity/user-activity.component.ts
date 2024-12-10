import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { UserActivityService } from './user-activity.service';

@Component({
    selector: 'app-user-activity',
    standalone: true,
    imports: [RouterLink, MatCardModule],
    templateUrl: './user-activity.component.html',
    styleUrl: './user-activity.component.scss'
})
export class UserActivityComponent {

    constructor(
        private userActivityService: UserActivityService
    ) {}

    ngOnInit(): void {
        this.userActivityService.loadChart();
    }

}