import { Component, Input, OnInit } from '@angular/core';
import { Category, Expense } from '../models';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { ReloadService } from '../services/reload-service/reload.service';

@Component({
  selector: 'app-evolution-chart',
  templateUrl: './evolution-chart.component.html',
  styleUrls: ['./evolution-chart.component.css']
})
export class EvolutionChartComponent implements OnInit {

  @Input() selectedTab = "";
  @Input() startDate!: Date;
  @Input() endDate!: Date;

  categories: Category[] = [];
  expenses: Expense[] = [];
  userId: number = Number(localStorage.getItem('userId'));
  data: {
    name: string,
    series: {
      name: string,
      value: number,
      color?: string
    }[]
  }[] = [];
  showChart = false;
  totalAmount!: number;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: []
  };

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    public reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchExpenses();

    this.reloadService.tabChange$.subscribe(tabName => {
      if (tabName) {
        
        this.getTotalAmount(this.userId, tabName);
      }
    });
  }

  getTotalAmount(userId: number, period: string): void {
    const date = new Date();
    let startDate;
    let endDate;
    switch(period){
      case 'Day':
        startDate=new Date(date.getFullYear(), date.getMonth(), date.getDate());
        endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        break;
        
      case 'Week':
        startDate = new Date(date);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59);
        break;

      case 'Month':
        startDate=new Date(date.getFullYear(), date.getMonth(), 1);
        endDate=new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        break;

      case 'Year':
        startDate=new Date(date.getFullYear(), 0, 1);
        endDate=new Date(date.getFullYear(), 11, 31, 23, 59, 59);
        break;

      case 'Custom':
        break;
      }
      
    this.expenseService.getTotalAmountBetweenDates(userId, startDate,endDate, this.reloadService.getCurrentCurrency())
      .subscribe(amount => this.totalAmount = amount);
  }

  formatXAxis = (date: string) => {
    if (this.selectedTab == 'Month') {
      const dateObj = new Date(date);
      return dateObj.getDate().toString();
    }
    return date.split(' ')[0];
  };

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      this.colorScheme.domain = categories.map(cat => cat.color);
    });
  }

  fetchExpenses(): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), this.startDate, this.endDate, this.reloadService.getCurrentCurrency()).subscribe({
      next: (expenses: Expense[]) => {
        this.expenses = expenses;
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  }

  fetch(selectedTab: string): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), this.startDate, this.endDate, this.reloadService.getCurrentCurrency()).subscribe({
      next: (expenses: Expense[]) => {
        this.expenses = expenses;

        if (selectedTab == 'Month')
          this.groupExpensesByDay(expenses);
        if (selectedTab == 'Year')
          this.groupExpensesByMonth(expenses);

        const categoryColorMapping: { [key: string]: string } = {};

        this.data.forEach(monthData => {
          monthData.series.forEach(series => {
            const color = series.color || '#ccc'; // Default color
            categoryColorMapping[series.name] = color;
          });
        });

        this.data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

        this.colorScheme.domain = [...new Set(this.data.flatMap(monthData => monthData.series.map(s => s.color || '#ccc')))];

        this.showChart = this.data.length > 0;
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }


  getFilteredCategories(): Category[] {
    const categoryNames = this.data.map(d => d.name);
    return this.categories.filter(cat => categoryNames.includes(cat.description));
  }

  private groupExpensesByDay(expenses: Expense[]): void {

    const allDates = this.getAllDatesInRange(this.startDate, this.endDate);

    const groupedByDate: { [date: string]: { [category: string]: number } } = {};

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      const category = this.categories.find(cat => cat.id === expense.categoryId);

      if (category) {
        if (!groupedByDate[expenseDate]) {
          groupedByDate[expenseDate] = {};
        }

        if (!groupedByDate[expenseDate][category.description]) {
          groupedByDate[expenseDate][category.description] = 0;
        }

        groupedByDate[expenseDate][category.description] += expense.amount;
      }
    });

    allDates.forEach(date => {
      if (!groupedByDate[date]) {
        groupedByDate[date] = {};
        this.categories.forEach(cat => {
          groupedByDate[date][cat.description] = 0;
        });
      }
    });

    this.data = Object.keys(groupedByDate).map(date => ({
      name: date,
      series: Object.keys(groupedByDate[date]).filter(categoryName => groupedByDate[date][categoryName] > 0).map(categoryName => {
        const category = this.categories.find(cat => cat.description === categoryName);
        return {
          name: categoryName,
          value: groupedByDate[date][categoryName],
          color: category ? category.color : '#ccc'
        };
      })
    }));
  }

  private groupExpensesByMonth(expenses: Expense[]): void {

    const allMonths = this.getAllMonthsInRange(this.startDate, this.endDate);

    const groupedByMonth: { [month: string]: { [category: string]: number } } = {};

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const yearMonth = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`; // Format as 'YYYY-MM'
      const category = this.categories.find(cat => cat.id === expense.categoryId);

      if (category) {
        if (!groupedByMonth[yearMonth]) {
          groupedByMonth[yearMonth] = {};
        }

        if (!groupedByMonth[yearMonth][category.description]) {
          groupedByMonth[yearMonth][category.description] = 0;
        }

        groupedByMonth[yearMonth][category.description] += expense.amount;
      }
    });

    allMonths.forEach(month => {
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = {};
        this.categories.forEach(cat => {
          groupedByMonth[month][cat.description] = 0;
        });
      }
    });

    this.data = Object.keys(groupedByMonth).map(month => ({
      name: this.formatMonth(month),
      series: Object.keys(groupedByMonth[month])
        .filter(categoryName => groupedByMonth[month][categoryName] > 0)
        .map(categoryName => {
          const category = this.categories.find(cat => cat.description === categoryName);
          return {
            name: categoryName,
            value: groupedByMonth[month][categoryName],
            color: category ? category.color : '#ccc'
          };
        })
        .sort((cat1, cat2) => {
          const id1 = this.categories.find(cat => cat.description === cat1.name)?.id || 0;
          const id2 = this.categories.find(cat => cat.description === cat2.name)?.id || 0;
          return id1 - id2;
        })
    }));
  }


  private getAllDatesInRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      dates.push(`${year}-${month}-${day}`);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private getAllMonthsInRange(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const currentDate = new Date(startDate);
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;

    while (currentDate.getFullYear() < endYear || (currentDate.getFullYear() === endYear && currentDate.getMonth() + 1 <= endMonth)) {
      const yearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      months.push(yearMonth);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  }

  private formatMonth(yearMonth: string): string {
    const [year, month] = yearMonth.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }
}
