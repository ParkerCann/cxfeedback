import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';
import { SharedService } from '../shared.service';


export interface User {
  WorkerID: number,
  FullName: string;
}

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
  styleUrls: ['./name-input.component.css']
})

export class NameInputComponent implements OnInit {


  EmployeeIDsList: any=[];

  subEmployeeIDsList: any[] = this.EmployeeIDsList;

  refreshEmployeeIDList(){
    this.service.getEmployeeIDsList().subscribe(data=>{
      this.EmployeeIDsList=data;
    });
  }
  constructor(private service: SharedService){}

  myControl = new FormControl();

  ngOnInit() {
    this.refreshEmployeeIDList();
  }

  displayUsernameFn(EmployeeIDsList) {
    return EmployeeIDsList.FullName;
  }

  UsernameInputFn(event: KeyboardEvent): void {
    const filterValue = this.myControl.value.toLowerCase();
    const newArray = this.EmployeeIDsList.map(x => x.FullName).filter(FullName => FullName.toLowerCase().includes(filterValue));
    
    const filteredIndex = [];

    for (let index = 0; index < newArray.length; index++) {
      filteredIndex.push((this.getFilteredVals(index)));
    };
    const filteredResults = [];

    for (let index = 0; index < filteredIndex.length; index++) {
      filteredResults.push(this.EmployeeIDsList[filteredIndex[index]]);
    };

    this.subEmployeeIDsList = filteredResults;
 }

  getFilteredVals(index) {
    const filterValue = this.myControl.value.toLowerCase();
    const array = this.EmployeeIDsList.map(x => x.FullName);
    const newArray = this.EmployeeIDsList.map(x => x.FullName).filter(FullName => FullName.toLowerCase().includes(filterValue));

    return array.indexOf(newArray[index].toString());
  }

}
