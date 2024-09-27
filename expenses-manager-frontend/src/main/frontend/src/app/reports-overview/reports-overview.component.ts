import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Category, Expense } from '../models';
import { CategoryService } from '../services/category-service/category.service';
import { ExpenseService } from '../services/expense-service/expense.service';
import { EvolutionChartComponent } from '../evolution-chart/evolution-chart.component';
import { DailyStatsComponent } from '../daily-stats/daily-stats.component';

@Component({
  selector: 'app-reports-overview',
  templateUrl: './reports-overview.component.html',
  styleUrls: ['./reports-overview.component.scss']
})
export class ReportsOverviewComponent implements OnInit {

  constructor(private categoryService: CategoryService, private expenseService: ExpenseService) { }

  @ViewChild(DailyStatsComponent) dailyStats!: DailyStatsComponent;
  @ViewChild(EvolutionChartComponent) evolutionChart!: EvolutionChartComponent;

  startDate!: Date;
  endDate!: Date;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  expenses: Expense[] = [];
  categoryExpense: Map<number, number> = new Map<number, number>();

  @Input() selectedTab="";
  
  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (dbCategories) => {
        this.categories = dbCategories;
        this.update();
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description  ||'Unknown';
  }

  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.color || '#000000';
  }

  setExpensesForEachCategory(){
    for (const key of this.categoryExpense.keys())
      this.categoryExpense.set(key, 0);
    for (let expense of this.expenses){
      let currentValue = this.categoryExpense.get(expense.categoryId) || 0;
      this.categoryExpense.set(expense.categoryId, currentValue + expense.amount);
    }
  }

  filterCategories(){
    this.filteredCategories.splice(0, this.filteredCategories.length);
    for (let category of this.categories){
      if(this.categoryExpense.get(category.id))
        this.filteredCategories.push(category);
    }
  }

  update(){
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.expenses = response;
        this.setExpensesForEachCategory();
        this.filterCategories();
        this.dailyStats.fetch(this.startDate, this.endDate);
        this.evolutionChart.fetch(this.selectedTab);
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }


}
