import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';

import {AppComponent} from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ReportsComponent } from './reports/reports.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { DailyStatsComponent } from './daily-stats/daily-stats.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpenseService } from './services/expense-service/expense.service';


import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faDollarSign, faEuroSign, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

import { HttpClientModule } from '@angular/common/http';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {MatTabsModule} from "@angular/material/tabs";
import {TopbarComponent} from "./topbar/topbar.component";
import { DatePipe } from '@angular/common';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { EditExpenseDialogComponent } from './edit-expense-dialog/edit-expense-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        HomeComponent,
        ExpensesComponent,
        ReportsComponent,
        LoginComponent,
        AddExpenseDialogComponent,
        TopbarComponent,
        ExpenseTableComponent,
        NotificationComponent,
        DailyStatsComponent,
        EditExpenseDialogComponent,
        ConfirmDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        AppRoutingModule,
        FormsModule,
        MatInputModule,
        HttpClientModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        NgxChartsModule
    ],
    providers: [DatePipe, ExpenseService], 
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(
          faMoneyBill,
          faDollarSign,
          faEuroSign,
          faCalendar
        );
      }
}
