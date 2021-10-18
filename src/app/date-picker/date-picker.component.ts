import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  today= new Date();
  jstoday = '';
  formattedDate: string;


  constructor() { 
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy', 'en-US');
  }

  ngOnInit(): void {
  }

  selected: Date | null;
  slctdDate: string;

  updateSLCT(dateObject) {

    let frmtDate = formatDate(dateObject.value, 'MM-dd-YYYY', 'en-US');
    console.log(dateObject.value);
    console.log(formatDate(dateObject.value, 'MM-dd-YYYY', 'en-US'))

    this.formattedDate = frmtDate;
  }

}
