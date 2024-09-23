import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { Category, Expense } from '../models';

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit {

  currentDate = new Date();
  maxDate = new Date(); 
  startDate = new Date();
  endDate = new Date();

  categories: Category[] = []; 
  expenses: Expense[] = [];
  data: { name: string, value: number, color: string }[] = [];  
  showChart = false; 

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: []
  };

  constructor(
    private expenseService: ExpenseService, 
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.setDate();
    this.fetchCategories();
    this.fetchDataForSelectedDate(this.currentDate);
    this.fetchExpenses();

  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      this.colorScheme.domain = categories.map(cat => cat.color);
    });

  }

  fetchExpenses() : void {
      this.expenseService.getFilteredExpenses(localStorage.getItem("userId"), this.startDate, this.endDate).subscribe({
        next: (expenses : Expense[]) => {
          
          this.expenses = expenses;
          console.log(expenses);
          
        },
        error: (error) => {
          console.error('Error getting expenses:', error);
        }
      });
  }

  

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.currentDate = event.value;
      console.log(this.expenses);
      this.fetchDataForSelectedDate(this.currentDate);
    }
  }

  setDate() : void {
    this.startDate.setHours(0);
    this.startDate.setMinutes(0);
    this.startDate.setSeconds(0);
    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.endDate.setSeconds(59);
  }

  previousDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate); 
    this.fetchDataForSelectedDate(this.currentDate);
  }

  nextDay(): void {
    const tomorrow = new Date(this.currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow <= this.maxDate) {
      this.currentDate = tomorrow;
      this.fetchDataForSelectedDate(this.currentDate);
    }
  }

  fetchDataForSelectedDate(date: Date): void {
    // Resetăm datele pentru grafic
    this.data = [];
  
    // Setăm startDate și endDate pentru ziua selectată
    this.startDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.endDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    console.log(this.startDate);
    console.log(this.endDate);
    // Obținem cheltuielile
    this.fetch();
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  }
  
  fetch(): void {
    this.expenseService.getFilteredExpenses(localStorage.getItem("userId"), this.startDate, this.endDate).subscribe({
      next: (expenses: Expense[]) => {
        this.expenses = expenses;
        console.log(expenses);
        
        // Grupăm cheltuielile pe categorii
        const categoryTotals: { [key: string]: number } = {};
        expenses.forEach(expense => {
          const category = this.categories.find(cat => cat.id === expense.categoryId);
          if (category) {
            const categoryName = category.description;
  
            // Inițializăm totalul pentru categorie dacă nu există
            if (!categoryTotals[categoryName]) {
              categoryTotals[categoryName] = 0; // Inițializăm cu 0
            }
            // Adăugăm suma cheltuielilor
            categoryTotals[categoryName] += expense.amount;
          }
        });
  
        // Transformăm categoryTotals în formatul necesar pentru grafic
        this.data = Object.entries(categoryTotals)
          .filter(([_, total]) => total > 0) // Filtrăm categoriile cu total > 0
          .map(([name, total]) => {
            // Găsim categoria pentru a obține culoarea
            const category = this.categories.find(cat => cat.description === name);
            return {
              name,
              value: total,
              color: category ? category.color : '#ccc' 
            };
          });
  
        this.colorScheme.domain = this.data.map(d => d.color);
        console.log(this.data);
        console.log(this.colorScheme);
  
        this.showChart = true; 
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }
  
  
  
  
  

}
