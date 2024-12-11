import { Component } from '@angular/core';
import { ProfileIntroComponent } from './profile-intro/profile-intro.component';
import { UserBioComponent } from './user-bio/user-bio.component';
import { RevenueOverviewComponent } from './revenue-overview/revenue-overview.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ActivityComponent } from './activity/activity.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ProfileIntroComponent, UserBioComponent, RevenueOverviewComponent, ToDoListComponent, ActivityComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {}