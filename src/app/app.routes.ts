import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiguresShowcaseComponent } from './figures-showcase/figures-showcase.component';
import { LoginComponent } from './login/login.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { FandomsComponent } from './fandoms/fandoms.component';


export const routes: Routes = [
    { path: 'figures-showcase', component: FiguresShowcaseComponent},
    { path: 'login', component: LoginComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: 'fandoms', component: FandomsComponent },
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule],
// })
// export class AppRoutingModule {}