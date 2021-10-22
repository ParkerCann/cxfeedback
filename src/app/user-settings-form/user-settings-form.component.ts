import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { NgForm, ValidationErrors, Validators } from '@angular/forms';
import { DataService } from '../data/data.service';
import { Defaults } from '../data/defaults';
import {FormControl} from '@angular/forms';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../shared.service';
import { MatStepper } from '@angular/material/stepper';
import { AnswerFormComponent } from '../answer-form/answer-form.component';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


//https://www.youtube.com/watch?v=4a9VxZjnT7E&t=1011s
//https://app.pluralsight.com/course-player?clipId=6630af7f-67be-446d-8601-3563bf7d07c8

export interface EmployeeName {
  FullName: string
}

export interface CustomerName {
  CustomerName: string
}

export interface CarrierName {
  CarrierName: string
}

export interface feedbackID {
  feedbackid: string
}

export interface updateValues {
  respondeeid: number,
  productid: number,
  feedbacktypeid: number,
  datecompleted: string,
  conductor_id: number,
  callduration: string,
  respondeeTypeId: number,
  datesubmitted: string,
  feedbackid: string
}

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.css']
})

export class UserSettingsFormComponent implements OnInit {

  @ViewChild(AnswerFormComponent) child;

//defaults of default interface
  originalDefaults : Defaults = {
    respondeeid: 0,
    productid: 0,
    feedbacktypeid: 0,
    datecompleted: "",
    conductor_id: 0,
    callduration: "",
    respondeeTypeId: 0,
    datesubmitted: ""
  };

  updateValues : updateValues = {
    respondeeid: 0,
    productid: 0,
    feedbacktypeid: 0,
    datecompleted: "",
    conductor_id: 0,
    callduration: "",
    respondeeTypeId: 0,
    datesubmitted: "",
    feedbackid: ""
  }

  EmployeeName: EmployeeName = {
    FullName: ""
  };

  CustomerName: CustomerName = {
    CustomerName: ""
  };

  CarrierName: CarrierName = {
    CarrierName: ""
  };

  FeedbackID: feedbackID = {
    feedbackid: ""
  };

  Defaults : Defaults = { ...this.originalDefaults};
  postError = false;
  postErrorMessage = '';

  myDuration: string;
  customOutput: string;
  form: any;

  constructor(private dataservice: DataService,
              private service: SharedService) { }

  ProductList:any=[];
  subProductList: any[] = this.ProductList;
  EmployeeIDsList:any=[];
  subEmployeeIDsList: any[] = this.EmployeeIDsList;
  RespondeeTypeList:any=[];
  subRespondeeTypeList: any[] = this.RespondeeTypeList;
  FeedbackTypeList: any=[];
  subFeedbackTypeList: any=[] = this.FeedbackTypeList;
  CarrierList: any=[];
  subCarrierList: any=[] = this.CarrierList;
  CustomerList: any=[];
  subCustomerList: any=[] = this.CustomerList;
  EmployeeList: any=[];
  subEmployeeList: any=[] = this.EmployeeList;


  ngOnInit(): void {
   
    this.refreshProdList();
    this.refreshEmployeeIDList();
    this.refreshRespondeeTypeList();
    this.refreshFeedbackTypeList();
    this.refreshEmployeeList();
    this.refreshCustomerList();
    this.refreshCarrierList();
  }


    

  refreshEmployeeList(){
    this.service.getEmployeeList().subscribe(data=>{
      this.EmployeeList=data;
    });
  }
  refreshCustomerList(){
    this.service.getCustomerList().subscribe(data=>{
      this.CustomerList=data;
    });
  }
  refreshCarrierList(){
    this.service.getCarrierList().subscribe(data=>{
      this.CarrierList=data;
    });
  }
  refreshProdList(){
    this.service.getProductList().subscribe(data=>{
      this.ProductList=data;
      this.subProductList=data;
    });
  }
  refreshEmployeeIDList(){
    this.service.getEmployeeIDsList().subscribe(data=>{
      this.EmployeeIDsList=data;
      this.subEmployeeIDsList=data;
    });
  }
  refreshRespondeeTypeList(){
    this.service.getRespondeeTypeList().subscribe(data=>{
      this.RespondeeTypeList=data;
      this.subRespondeeTypeList=data;
    });
  }
  refreshFeedbackTypeList(){
    this.service.getFeedbackTypeList().subscribe(data=>{
      this.FeedbackTypeList=data;
      this.subFeedbackTypeList=data;
    });
  }
  

  onHttpError(errorResponse: any) {
    console.log('error:', HttpErrorResponse);
    this.postError = true;
    this.postErrorMessage = errorResponse.error.errorMessage;
  }

  //make sure that entered values correspond to an existing entry
  private requireUserNameMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.EmployeeIDsList && this.EmployeeIDsList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }
  //make sure that entered values correspond to an existing entry
  private requireProductMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.ProductList && this.ProductList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }
  //make sure that entered values correspond to an existing entry
  private requireRespondeeTypeMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.RespondeeTypeList && this.RespondeeTypeList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }
  //make sure that entered values correspond to an existing entry
  private requireEmployeeMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.subEmployeeList && this.subEmployeeList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }
  //make sure that entered values correspond to an existing entry
  private requireCustomerMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.subCustomerList && this.subCustomerList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }
  //make sure that entered values correspond to an existing entry
  private requireCarrierMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.subCarrierList && this.subCarrierList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    else if(selection == 0){
      this.myControlCarrier.clearValidators();
      return null;
    }
    return null;
  }

  //make sure that entered values correspond to an existing entry
  private requireFeedbackTypeMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.FeedbackTypeList && this.FeedbackTypeList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }

  //set some variables
  selected: Date | null;
  slctdDate: string;
  today= new Date();
  jstoday = '';
  formattedDate: string;

  successfulSubmit: boolean = false;

  //https://stackoverflow.com/questions/46469233/can-i-programmatically-move-the-steps-of-a-mat-horizontal-stepper-in-angular-a
  @ViewChild('stepper') private myStepper: MatStepper;

  goBack(){
    this.myStepper.previous();
  }

  goForward(){
      this.myStepper.next();
  }

  defaultsBackup: any = [];


  //validation and changes to run on submisison
  onSubmit(form: NgForm) {

    this.defaultsBackup = JSON.stringify(this.Defaults);
    
    const durationString = document.getElementById('dp-duration-value').innerHTML;
    let durationVariable = moment(durationString, 'HH:mm:ss');
    let durationValue = durationVariable.format('HH:mm:ss');

    //correctly format the date and duration
    if(this.Defaults.datecompleted == null){
    }
    else if (this.Defaults.datecompleted == ""){
    }
    else{
      this.Defaults.datecompleted = formatDate(this.Defaults.datecompleted, 'MM-dd-YYYY', 'en-US');
    }
    this.Defaults.callduration = durationValue;


    //check for nulls
    if(this.Defaults.conductor_id == 0){

      document.getElementById("autoUsername").classList.add("alert");
      document.getElementById("username-error").classList.remove("hidden");
    } 
    else if(this.Defaults.respondeeTypeId == 0){

      document.getElementById("autoRespondeetype").classList.add("alert");
      document.getElementById("respondeetype-error").classList.remove("hidden");
    } 
    else if(this.Defaults.respondeeTypeId[Object.keys(this.Defaults.respondeeTypeId)[0]] > 1){
      
      var autoRespondee = document.getElementById("autoRespondee");
      var respondeeError = document.getElementById("respondee-error");

      if (autoRespondee != null){
        autoRespondee.classList.add("alert");
      }
      if (respondeeError != null && this.checked == false){
        respondeeError.classList.remove("hidden");
      }
    }
    else if(this.Defaults.productid == 0){

      document.getElementById("autoProduct").classList.add("alert");
      document.getElementById("product-error").classList.remove("hidden");
    }
    else if(this.Defaults.feedbacktypeid == 0){

      document.getElementById("autoFeedbackType").classList.add("alert");
      document.getElementById("feedbacktype-error").classList.remove("hidden");
    }
    else if(this.Defaults.datecompleted == ""){

      document.getElementById("date-error").classList.remove("hidden");
    }
    else if(document.getElementById('datepicker').classList.contains('ng-invalid')){

      document.getElementById("date-error").classList.remove("hidden");
    }
    //check if any errors exist on the DOM, and if there are any, display them
    //https://stackoverflow.com/questions/49425706/how-to-stop-mat-autocomplete-to-take-custom-user-input-values-apart-from-given-o
    else if(document.querySelectorAll('mat-error').length > 0)
    {
      if(document.querySelectorAll('mat-error').length > 0)
      {
       console.log("There is an error");
       console.log(document.querySelectorAll('mat-error'));
       var errors = document.querySelectorAll('mat-error');
       var numOfErrors = document.querySelectorAll('mat-error').length;
       for(let i=0; i < numOfErrors; i++){
         console.log(errors[i]);
         errors[i].classList.remove("hidden");
       }
      }
    }
    else {

      // if(this.Defaults.respondeeTypeId[Object.keys(this.Defaults.respondeeTypeId)[0]] == 1 && this.checked == true){
      //   this.myControlCarrier.clearValidators();
      // }
      // else if(this.Defaults.respondeeTypeId[Object.keys(this.Defaults.respondeeTypeId)[0]] == 2 && this.checked == true){
      //   this.myControlCustomer.clearValidators();
      // }
      // else if(this.Defaults.respondeeTypeId[Object.keys(this.Defaults.respondeeTypeId)[0]] == 3 && this.checked == true){
      //   this.myControlEmployee.clearValidators();
      // }

      this.myControlCarrier.clearValidators();
      this.myControlCustomer.clearValidators();
      this.myControlEmployee.clearValidators();

      //only get the id from the whole Object
      this.Defaults.conductor_id = this.Defaults.conductor_id[Object.keys(this.Defaults.conductor_id)[0]];
      this.Defaults.respondeeTypeId = this.Defaults.respondeeTypeId[Object.keys(this.Defaults.respondeeTypeId)[0]];
      if(this.checked == false){
        this.Defaults.respondeeid = this.Defaults.respondeeid[Object.keys(this.Defaults.respondeeid)[0]];
      }
      else if(this.checked == true){
        this.Defaults.respondeeid = null;
      }
      this.Defaults.productid = this.Defaults.productid[Object.keys(this.Defaults.productid)[0]];
      this.Defaults.feedbacktypeid = this.Defaults.feedbacktypeid[Object.keys(this.Defaults.feedbacktypeid)[0]];
      this.Defaults.datesubmitted = document.getElementById('currentDateTime').innerText.toString();
      
      //posts the form and returns the submitted info
      if(form.valid) {
        this.removeFeedbackId();
        
        if(this.successfulSubmit == false){
            this.service.addFeedback(this.Defaults).subscribe(
            result => this.setFeedbackId(result.toString()),
            error => this.onHttpError(error)
          );

          document.getElementById('successConfirm').classList.remove('hidden');
          document.getElementById('successConfirmText').classList.remove('hidden');

          this.successfulSubmit = true;
        }
        else if(this.successfulSubmit == true){

          if(localStorage.getItem('currentFeedbackID') == null){
            alert("Please create a feedback entry before attempting to update.")
          }
          else{
            this.updateValues.respondeeTypeId = this.Defaults.respondeeTypeId;
            this.updateValues.respondeeid = this.Defaults.respondeeid;
            this.updateValues.productid = this.Defaults.productid;
            this.updateValues.feedbacktypeid = this.Defaults.feedbacktypeid;
            this.updateValues.callduration = this.Defaults.callduration;
            this.updateValues.datesubmitted = this.Defaults.datesubmitted;
            this.updateValues.datecompleted = this.Defaults.datecompleted;
            this.updateValues.conductor_id = this.Defaults.conductor_id;
            this.updateValues.feedbackid = (localStorage.getItem('currentFeedbackID'));

            console.log("updateValues:");
            console.log(this.updateValues);
            
            this.alterData();
            document.getElementById('successConfirm').classList.remove('hidden');
            document.getElementById('successUpdateText').classList.remove('hidden');
          }
          
          
        }

        this.showFeedbackID();

        this.removeData();
        this.setData();
        
        setTimeout(() => {
          this.child.refreshFeedbackList();
        }, 250);
        
        this.fillAnswerFormData();

        this.goForward();

      }
      //Check for errors
      else {
      this.postError = true;
      console.log("Form is invalid.");
      }
    }
  }

  showFeedbackID(){
    setTimeout(() => {
      this.returnedFeedbackIDText = this.getFeedbackId();
    }, 500);
  }

  returnedFeedbackIDText: String;

  //create individual form controls
  myControlName = new FormControl(undefined, [Validators.required, this.requireUserNameMatch.bind(this)]);
  myControlRespondeeType = new FormControl(undefined, [Validators.required, this.requireRespondeeTypeMatch.bind(this)]);
  myControlEmployee = new FormControl(undefined, [Validators.required, this.requireEmployeeMatch.bind(this)]);
  myControlCustomer = new FormControl(undefined, [Validators.required, this.requireCustomerMatch.bind(this)]);
  myControlCarrier = new FormControl(undefined, [Validators.required, this.requireCarrierMatch.bind(this)]);
  myControlProduct = new FormControl(undefined, [Validators.required, this.requireProductMatch.bind(this)]);
  myControlFeedbackType = new FormControl(undefined, [Validators.required, this.requireFeedbackTypeMatch.bind(this)]);

  //default state of checkbox
  checked = false;

  onChangeEmp(ob: MatCheckboxChange) {
    let auto = document.getElementById('autoRespondee') as HTMLInputElement;
    var chkbox = document.getElementById('chkbox-input') as HTMLInputElement;
    //clear error messages
    document.getElementById("autoRespondee").classList.remove("alert");
    document.getElementById("respondee-error").classList.add("hidden");

    //disable input if checkbox is checked, 
    if (chkbox.checked == true){
      auto.disabled = true;
    }
    else{
      auto.disabled = false;
    }
  }
  onChangeCust(ob: MatCheckboxChange) {
    let auto = document.getElementById('autoRespondee') as HTMLInputElement;
    var chkbox = document.getElementById('chkbox-input') as HTMLInputElement;
    //clear error messages
    document.getElementById("autoRespondee").classList.remove("alert");
    document.getElementById("respondee-error").classList.add("hidden");

    //disable input if checkbox is checked, 
    if (chkbox.checked == true){
      auto.disabled = true;
      this.Defaults.respondeeid = 0;
    }
    else{
      auto.disabled = false;
    }
  }
  onChangeCarrier(ob: MatCheckboxChange) {
    let auto = document.getElementById('autoRespondee') as HTMLInputElement;
    var chkbox = document.getElementById('chkbox-input') as HTMLInputElement;
    //clear error messages
    document.getElementById("autoRespondee").classList.remove("alert");
    document.getElementById("respondee-error").classList.add("hidden");

    //disable input if checkbox is checked, 
    if (chkbox.checked == true){
      auto.disabled = true;
      this.Defaults.respondeeid = 0;
      this.form.get('respondeeid').setErrors(null);
    }
    else{
      auto.disabled = false;
    }
  } 


 displayProductFn(ProductList) {
  return ProductList?.product_name;
}
 ProductInputFn(event: KeyboardEvent): void {
  const filterValue = this.myControlProduct.value.toLowerCase();
  const newArray = this.ProductList.map(x => x.product_name).filter(product_name => product_name.toLowerCase().includes(filterValue));
  
  const filteredIndex = [];

  for (let index = 0; index < newArray.length; index++) {
    filteredIndex.push((this.getFilteredProductVals(index)));
  };
  const filteredResults = [];

  for (let index = 0; index < filteredIndex.length; index++) {
    filteredResults.push(this.ProductList[filteredIndex[index]]);
  };

  this.subProductList = filteredResults;
}
 getFilteredProductVals(index) {
  const filterValue = this.myControlProduct.value.toLowerCase();
  const array = this.ProductList.map(x => x.product_name);
  const newArray = this.ProductList.map(x => x.product_name).filter(product_name => product_name.toLowerCase().includes(filterValue));

  return array.indexOf(newArray[index].toString());
}



displayUsernameFn(EmployeeIDsList) {
  return EmployeeIDsList?.FullName;
}
UsernameInputFn(event: KeyboardEvent): void {
  const filterValue = this.myControlName.value.toLowerCase();
  const newArray = this.EmployeeIDsList.map(x => x.FullName).filter(FullName => FullName.toLowerCase().includes(filterValue));
  
  const filteredIndex = [];

  for (let index = 0; index < newArray.length; index++) {
    filteredIndex.push((this.getFilteredUserNameVals(index)));
  };
  const filteredResults = [];

  for (let index = 0; index < filteredIndex.length; index++) {
    filteredResults.push(this.EmployeeIDsList[filteredIndex[index]]);
  };

  this.subEmployeeIDsList = filteredResults;
}
getFilteredUserNameVals(index) {
  const filterValue = this.myControlName.value.toLowerCase();
  const array = this.EmployeeIDsList.map(x => x.FullName);
  const newArray = this.EmployeeIDsList.map(x => x.FullName).filter(FullName => FullName.toLowerCase().includes(filterValue));

  return array.indexOf(newArray[index].toString());
}


displayRespondeeTypeFn(RespondeeTypeList) {
  return RespondeeTypeList?.respondee_type;
}
RespondeeTypeInputFn(event: KeyboardEvent): void {
  const filterValue = this.myControlRespondeeType.value.toLowerCase();
  const newArray = this.RespondeeTypeList.map(x => x.respondee_type).filter(respondee_type => respondee_type.toLowerCase().includes(filterValue));
  
  const filteredIndex = [];

  for (let index = 0; index < newArray.length; index++) {
    filteredIndex.push((this.getFilteredRespondeeTypeVals(index)));
  };
  const filteredResults = [];

  for (let index = 0; index < filteredIndex.length; index++) {
    filteredResults.push(this.RespondeeTypeList[filteredIndex[index]]);
  };

  this.subRespondeeTypeList = filteredResults;
}
getFilteredRespondeeTypeVals(index) {
  const filterValue = this.myControlRespondeeType.value.toLowerCase();
  const array = this.RespondeeTypeList.map(x => x.respondee_type);
  const newArray = this.RespondeeTypeList.map(x => x.respondee_type).filter(respondee_type => respondee_type.toLowerCase().includes(filterValue));

  return array.indexOf(newArray[index].toString());
}

displayFeedbackTypeFn(FeedbackTypeList) {
  return FeedbackTypeList?.feedback_name;
}
FeedbackTypeInputFn(event: KeyboardEvent): void {
  const filterValue = this.myControlFeedbackType.value.toLowerCase();
  const newArray = this.FeedbackTypeList.map(x => x.feedback_name).filter(feedback_name => feedback_name.toLowerCase().includes(filterValue));
  
  const filteredIndex = [];

  for (let index = 0; index < newArray.length; index++) {
    filteredIndex.push((this.getFilteredFeedbackTypeVals(index)));
  };
  const filteredResults = [];

  for (let index = 0; index < filteredIndex.length; index++) {
    filteredResults.push(this.FeedbackTypeList[filteredIndex[index]]);
  };

  this.subFeedbackTypeList = filteredResults;
}
getFilteredFeedbackTypeVals(index) {
  const filterValue = this.myControlFeedbackType.value.toLowerCase();
  const array = this.FeedbackTypeList.map(x => x.feedback_name);
  const newArray = this.FeedbackTypeList.map(x => x.feedback_name).filter(feedback_name => feedback_name.toLowerCase().includes(filterValue));

  return array.indexOf(newArray[index].toString());
}

displayEmployeeFn(SubEmployeeList) {
  return SubEmployeeList?.FullName;
}
EmployeeInputFn(event: KeyboardEvent): void {
  this.EmployeeName.FullName = this.myControlEmployee.value;
  if(this.EmployeeName.FullName !== ""){
    this.service.getFilteredEmployeeList(this.EmployeeName).subscribe(
      result => this.subEmployeeList = (result),
      error => this.onHttpError(error)
    );
  }
    
}

displayCustomerFn(SubCustomerList) {
  return SubCustomerList?.CustomerName;
}
CustomerInputFn(event: KeyboardEvent): void {
  this.CustomerName.CustomerName = this.myControlCustomer.value;
  if(this.CustomerName.CustomerName !== ""){
    this.service.getFilteredCustomerList(this.CustomerName).subscribe(
      result => this.subCustomerList = (result),
      error => this.onHttpError(error)
    );
  }

    
}

displayCarrierFn(subCarrierList) {
  return subCarrierList?.CarrierName;
}
CarrierInputFn(event: KeyboardEvent): void {
  this.CarrierName.CarrierName = this.myControlCarrier.value;
  if(this.CarrierName.CarrierName !== ""){
    this.service.getFilteredCarrierList(this.CarrierName).subscribe(
      result => this.subCarrierList = (result),
      error => this.onHttpError(error)
    );  
  }
  
}


 clrUsernameAlert(){
  document.getElementById("autoUsername").classList.remove("alert");
  document.getElementById("username-error").classList.add("hidden");
 }

 clrRespondeetypeAlert(){
  document.getElementById("autoRespondeetype").classList.remove("alert");
  document.getElementById("respondeetype-error").classList.add("hidden");
 }

 clrRespondeeAlert(){
  document.getElementById("autoRespondee").classList.remove("alert");
  document.getElementById("respondee-error").classList.add("hidden");
 }

 clrProductAlert(){
  document.getElementById("autoProduct").classList.remove("alert");
  document.getElementById("product-error").classList.add("hidden");
 }

 clrFeedbackTypeAlert(){
  document.getElementById("autoFeedbackType").classList.remove("alert");
  document.getElementById("feedbacktype-error").classList.add("hidden");
 }

 clrDateAlert(){
  document.getElementById("date-error").classList.add("hidden");
 }

 refreshBtn() {

}


 chkEmployee: boolean = false;
 chkCustomer: boolean = false;
 chkCarrier: boolean = false;

 
 chkRespondeeType(){
   if(this.Defaults.respondeeTypeId == this.RespondeeTypeList[3]){
    this.chkEmployee = true;
    this.chkCustomer = false;
    this.chkCarrier = false;
   }
   else if(this.Defaults.respondeeTypeId == this.RespondeeTypeList[1]){
     this.chkCarrier = true;
     this.chkCustomer = false;
     this.chkEmployee = false;
   }
   else if(this.Defaults.respondeeTypeId == this.RespondeeTypeList[2]){
     this.chkCustomer = true;
     this.chkCarrier = false;
     this.chkEmployee = false;
   }
   else if(this.Defaults.respondeeTypeId == this.RespondeeTypeList[0]){
    this.chkCustomer = false;
    this.chkCarrier = false;
    this.chkEmployee = false;
  }
   else{
     alert("Please choose a valid respondee type.");
   }
 }

 hideSuccess(){
  document.getElementById('successConfirm').classList.add('hidden');
 }

 hideUpdate(){
  document.getElementById('updateConfirm').classList.add('hidden');
 }

 setData(){
   const jsonData = this.defaultsBackup;
   localStorage.setItem('myData', jsonData);
 }

 getData() {
   const storedData = localStorage.getItem('myData');
   const parsedData = JSON.parse(storedData);
   const mapped = Object.keys(parsedData).map(key => ({type: key, value: parsedData[key]}));

   this.Defaults = parsedData;
  }

  removeData() {
    const storedData = localStorage.getItem('myData');
    localStorage.removeItem('myData');
  }

  setFeedbackId(value: string){
      localStorage.setItem('currentFeedbackID', value);
  }

  getFeedbackId() {
    const storedData = localStorage.getItem('currentFeedbackID');
    const parsedData = JSON.parse(storedData);
    
    return parsedData;
   }

  removeFeedbackId() {
    const storedData = localStorage.getItem('currentFeedbackID');
    localStorage.removeItem('currentFeedbackID');
  }

 
  fillAnswerFormData(){
    this.child.getData();
  }

  alterData(){
    this.service.updateFeedback(this.updateValues).subscribe(
      result => console.log("result: " + result),
      error => this.onHttpError(error)
    );
  }

  switchUpdate(){
    if(this.successfulSubmit == false){
      this.successfulSubmit = true;
    }
    else if(this.successfulSubmit == true){
      this.successfulSubmit = false;
    } 
  }

  test(){
  }

}
