import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ConnectionsComponent } from './settings/connections/connections.component';
import { PrivacyPolicyComponent } from './settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
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
        {
            path: 'settings',
            component: SettingsComponent,
            children: [
                {path: '', component: AccountSettingsComponent},
                {path: 'change-password', component: ChangePasswordComponent},
                {path: 'connections', component: ConnectionsComponent},
                {path: 'privacy-policy', component: PrivacyPolicyComponent},
                {path: 'terms-conditions', component: TermsConditionsComponent}
            ]
        },
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