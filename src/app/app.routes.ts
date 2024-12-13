import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { AuthenticationComponent } from './features/authentication/authentication.component';
import { SignInComponent } from './features/authentication/sign-in/sign-in.component';
import { ConfirmEmailComponent } from './features/authentication/confirm-email/confirm-email.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/account/profile/profile.component';

export const routes: Routes = [
    { path: '', canActivate: [AuthGuard], children: [
        // {path: '', component: EcommerceComponent},
        {path: 'blank-page', component: BlankPageComponent},
        {path: 'internal-error', component: InternalErrorComponent},
        {path: 'profile', component: ProfileComponent},
    ]},
    {
        path: 'auth',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent, },
            {path: 'login', component: SignInComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent}
        ]
    },

    {path: '**', component: NotFoundComponent}
];