import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.gurad';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent, canActivate: [NoAuthGuard] },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
];
