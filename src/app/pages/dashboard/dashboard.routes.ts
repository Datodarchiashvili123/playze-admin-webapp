import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'announcement',
        loadComponent: () =>
          import('../announcement/announcement.component').then(
            (m) => m.AnnouncementComponent
          ),
      },
      {
        path: 'announcement/:id',
        loadComponent: () =>
          import('../news-description/news-description.component').then(
            (m) => m.NewsDescriptionComponent
          ),
      },
      {
        path: 'news-types',
        loadComponent: () =>
          import('../news-types/news-types.component').then(
            (m) => m.NewsTypesComponent
          ),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('../user/user.component').then((m) => m.UserComponent),
      },
      {
        path: 'slider',
        loadComponent: () =>
          import('../home-slider/home-slider.component').then(
            (m) => m.HomeSliderComponent
          ),
      },
      { path: '', redirectTo: '/dashboard/user', pathMatch: 'full' },
    ],
  },
];
