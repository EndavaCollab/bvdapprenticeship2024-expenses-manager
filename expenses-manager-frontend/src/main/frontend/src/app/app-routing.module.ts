import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ReportsComponent } from './reports/reports.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'home', 
    component: HomeComponent,
  },
  {
      path: 'expenses', 
      component: ExpensesComponent,
  },
  {
      path: 'reports', 
      component: ReportsComponent,
  },
  {
      path: 'login', 
      component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
