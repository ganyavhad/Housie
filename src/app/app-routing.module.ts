import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component'
import { TableComponent } from './table/table.component';
import { InsideTableComponent } from './inside-table/inside-table.component';
import {
  AuthGuardService as AuthGuard
} from "./auth-gaurd.service"

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'table',
    component: TableComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'inside-table/:id',
    component: InsideTableComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/table', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
