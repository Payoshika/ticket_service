import { Routes } from '@angular/router';
import { TicketViewComponent } from './components/ticket-view/ticket-view.component';
import { ContainerComponent } from './container/container.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
    {path : 'tickets', component: TicketViewComponent},
    { path: '', redirectTo: 'tickets', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'tickets' }
];
