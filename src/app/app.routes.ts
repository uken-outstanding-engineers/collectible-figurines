import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiguresShowcaseComponent } from './figures-showcase/figures-showcase.component';
import { LoginComponent } from './login/login.component';
import { FandomsComponent } from './fandoms/fandoms.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FigureComponent } from './figure/figure.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminPanelFigurinesListComponent } from './admin-panel-figurines-list/admin-panel-figurines-list.component';
import { AdminPanelUsersComponent } from './admin-panel-users-list/admin-panel-users-list.component';
import { AuthGuard } from './authorization/auth.guard';
import { AdminPanelVariantsListComponent } from './admin-panel-variants-list/admin-panel-variants-list.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsAccountComponent } from './settings-account/settings-account.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { AdminPanelDashboardComponent } from './admin-panel-dashboard/admin-panel-dashboard.component';
import { UserFigurineListsComponent } from './user-figurine-lists/user-figurine-lists.component';
import { AdminPanelFandomsListComponent } from './admin-panel-fandoms-list/admin-panel-fandoms-list.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/figures-showcase', pathMatch: 'full' }, 
    { path: 'figures-showcase', component: FiguresShowcaseComponent },
    { path: 'figure/:id', component: FigureComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'fandoms', component: FandomsComponent },
    {
      path: 'admin',
      component: AdminPanelComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'dashboard', component: AdminPanelDashboardComponent },
        { path: 'figurines', component: AdminPanelFigurinesListComponent },
        { path: 'variants', component: AdminPanelVariantsListComponent },
        { path: 'fandoms', component: AdminPanelFandomsListComponent},
        { path: 'users', component: AdminPanelUsersComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      ],
    },
    {
      path: 'settings',
      component: SettingsComponent,
      children: [
        { path: "profile", component: SettingsProfileComponent},
        { path: 'notifications', component: SettingsNotificationsComponent },
        { path: 'account', component: SettingsAccountComponent },
        { path: '', redirectTo: 'profile', pathMatch: 'full' },
      ],
    },
    { path: 'figurine-lists', component: UserFigurineListsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '/figures-showcase' },
  ];
  

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule],
// })
// export class AppRoutingModule {}