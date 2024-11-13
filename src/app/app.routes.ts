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

export const routes: Routes = [
    { path: '', component: FiguresShowcaseComponent},
    { path: 'figures-showcase', component: FiguresShowcaseComponent},
    { path: 'figure/:id', component: FigureComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: 'fandoms', component: FandomsComponent },
    { path: 'news', component: NewsComponent },
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule],
// })
// export class AppRoutingModule {}