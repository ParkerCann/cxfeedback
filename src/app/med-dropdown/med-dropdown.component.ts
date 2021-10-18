import { Component, OnInit } from '@angular/core';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-med-dropdown',
  templateUrl: './med-dropdown.component.html',
  styleUrls: ['./med-dropdown.component.css']
})

export class MedDropdownComponent implements OnInit {

   


  options: Option[] = [
    {value: 'option-0', viewValue: 'Option 1'},
    {value: 'option-1', viewValue: 'Option 2'},
    {value: 'option-2', viewValue: 'Option 3'}
  ];

  constructor() { }

  ngOnInit(): void {
  }  
}


