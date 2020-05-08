import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component'
import { TableComponent } from './table/table.component';
import { InsideTableComponent } from './inside-table/inside-table.component';
import {
  AuthGuardService as AuthGuard
} from "./auth-gaurd.service"
import { WinnerComponent } from './winner/winner.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'table/:id',
    component: TableComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'inside-table/:id',
    component: InsideTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'winner/:id',
    component: WinnerComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
