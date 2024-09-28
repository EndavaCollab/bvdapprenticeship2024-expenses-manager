import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

import * as moment from 'moment';
import { Moment } from 'moment';
import { ReloadService } from '../services/reload-service/reload.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

  date = new FormControl(moment());
  currentDate:Date = new Date();

  public selectedTab = ''; // Variabilă internă pentru stocarea valorii

  @Input() startDate!: Date;
  @Input() endDate!: Date;

  @Output() startDateChange = new EventEmitter<Date>();
  @Output() endDateChange = new EventEmitter<Date>();

  @Output() updateRequest = new EventEmitter();

  onTabChange(period: string) {
    const momentDate = this.date.value;
    switch (period) {
      case 'Day':
        this.startDate = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 0, 0, 0);
        this.endDate = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 23, 59, 59);
        this.startDateChange.emit(this.startDate);
        this.endDateChange.emit(this.endDate);
        this.updateRequest.emit();
        break;

      case 'Week':
        break;

      case 'Month':
        this.startDate = new Date(momentDate.year(), momentDate.month(), 1, 0, 0, 0);
        const nextMonth = this.startDate.getMonth() + 1;
        const nextYear = nextMonth === 12 ? this.startDate.getFullYear() + 1 : this.startDate.getFullYear();
        const firstDayOfNextMonth = new Date(nextYear, nextMonth % 12, 1);
        const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
        this.endDate = new Date(momentDate.year(), momentDate.month(), lastDayOfMonth.getDate(), 23, 59, 59);
        this.startDateChange.emit(this.startDate);
        this.endDateChange.emit(this.endDate);
        this.updateRequest.emit();
        break;

      case 'Year':
        this.startDate = new Date(momentDate.year(), 0, 1, 0, 0, 0);
        this.endDate = new Date(momentDate.year(), 11, 31, 23, 59, 59);
        this.startDateChange.emit(this.startDate);
        this.endDateChange.emit(this.endDate);
        this.updateRequest.emit();
        break;

      case 'Custom':
        break;
    }
  }
  constructor(public reloadService: ReloadService) { }

  ngOnInit(): void {
    this.reloadService.tabChange$.subscribe(tabName => {
      if (tabName) {
        this.selectedTab=tabName;
        this.onTabChange(tabName);
      }
    });
  }

  setDay(event: MatDatepickerInputEvent<Date>, datepicker: MatDatepicker<Moment>) {
    const selectedDate = moment(event.value);
    this.date.setValue(selectedDate);
    this.updateTable("day");

    datepicker.close();
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value.clone() as Moment;
    const newMonthAndYear = moment(normalizedMonthAndYear);
    
    if (ctrlValue) {
      const updatedDate = ctrlValue.year(newMonthAndYear.year()).month(newMonthAndYear.month());
      this.date.setValue(updatedDate);
      this.updateTable("month");
      
      datepicker.close();
    }
  }

  setYear(normalizedYear: Date, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value.clone() as Moment;
    const newYear = moment(normalizedYear);
    
    if (ctrlValue) {
      const updatedDate = ctrlValue.year(newYear.year());
      this.date.setValue(updatedDate);
      this.updateTable("year");
      
      datepicker.close();
    }
  }

  updateTable(selectedTime: string) {
    this.startDate.setFullYear(this.date.value.year());
    this.endDate.setFullYear(this.date.value.year());
    if (selectedTime == "month" || selectedTime == "day") {
      this.startDate.setMonth(this.date.value.month());
      this.endDate.setDate(1); // ca să nu treacă la luna următoare când folosim funcția setMonth
      this.endDate.setMonth(this.date.value.month());

      if (selectedTime == "day") {
        this.startDate.setDate(this.date.value.date());
        this.endDate.setDate(this.date.value.date());
      }
      else {
        const nextMonth = this.startDate.getMonth() + 1;
        const nextYear = nextMonth === 12 ? this.startDate.getFullYear() + 1 : this.startDate.getFullYear();
        const firstDayOfNextMonth = new Date(nextYear, nextMonth % 12, 1);
        const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
        this.endDate.setDate(lastDayOfMonth.getDate());
      }
    }
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.updateRequest.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  openDatepicker(datepicker: MatDatepicker<moment.Moment>) {
    datepicker.open();
    this.updateOverlay();
  }

  private updateOverlay() {
    setTimeout(() => {
      const changeViewButton = document.querySelector('.mat-calendar-period-button');
      if (changeViewButton) {
        if (this.selectedTab !== "Day") {
          changeViewButton.classList.add('hide-change-view-button');
        } else {
          changeViewButton.classList.remove('hide-change-view-button');
        }
      }
    }, 0);
  }

  displayDay(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('DD MMMM YYYY') : 'Select Day';
  }

  displayMonthAndYear(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('MMMM YYYY') : 'Select Month/Year';
  }

  displayYear(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('YYYY') : 'Select Year';
  }

  goToPreviousDay(): void{
    this.date.value.subtract(1, 'day');
    this.updateTable("day");
  }

  goToNextDay(): void{
    this.date.value.add(1, 'day');
    this.updateTable("day");
  }

  goToPreviousMonth(): void{
    this.date.value.subtract(1, 'month');
    this.updateTable("month");
  }

  goToNextMonth(): void{
    this.date.value.add(1, 'month');
    this.updateTable("month");
  }

  goToPreviousYear(): void{
    this.date.value.subtract(1, 'year');
    this.updateTable("year");
  }

  goToNextYear(): void{
    this.date.value.add(1, 'year');
    this.updateTable("year");
  }

  disableButton(): boolean{
    if (this.selectedTab==="Year" && this.date.value.year()==this.currentDate.getFullYear())
      return true;
    if (this.selectedTab==="Month" && this.date.value.year()==this.currentDate.getFullYear() && this.date.value.month()==this.currentDate.getMonth())
      return true;
    if (this.selectedTab==="Day" && this.date.value.year()==this.currentDate.getFullYear() && this.date.value.month()==this.currentDate.getMonth() && this.date.value.date()==this.currentDate.getDate())
      return true;
    return false;
  }
}
