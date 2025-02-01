import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiguresShowcaseComponent } from './figures-showcase/figures-showcase.component';
import { LoginComponent } from './login/login.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { FandomsComponent } from './fandoms/fandoms.component';
import { NewsComponent } from './news/news.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FigureComponent } from './figure/figure.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminPanelFigurinesListComponent } from './admin-panel-figurines-list/admin-panel-figurines-list.component';
import { AdminPanelUsersComponent } from './admin-panel-users-list/admin-panel-users-list.component';

import { AuthGuard } from './authorization/auth.guard';
import { AdminPanelVariantsListComponent } from './admin-panel-variants-list/admin-panel-variants-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/figures-showcase', pathMatch: 'full' }, 
    { path: 'figures-showcase', component: FiguresShowcaseComponent },
    { path: 'figure/:id', component: FigureComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: 'fandoms', component: FandomsComponent },
    { path: 'news', component: NewsComponent },
    {
      path: 'admin',
      component: AdminPanelComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'figurines', component: AdminPanelFigurinesListComponent },
        { path: 'variants', component: AdminPanelVariantsListComponent },
        { path: 'users', component: AdminPanelUsersComponent },
        { path: '', redirectTo: 'figurines', pathMatch: 'full' },
      ],
    },
    { path: '**', redirectTo: '/figures-showcase' },
  ];
  

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule],
// })
// export class AppRoutingModule {}