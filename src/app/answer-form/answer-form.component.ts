import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { DataService } from '../data/data.service';
import { answerFormVals } from '../data/answerFormValues';
import {FormControl} from '@angular/forms';
import { Time, formatDate, NumberSymbol } from '@angular/common';
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../shared.service';
import { Defaults } from '../data/defaults';
import { Router, NavigationEnd } from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { ResponseInputComponent } from './response-input/response-input.component';
import { updateValues } from '../user-settings-form/user-settings-form.component';

export interface feedbackid {
  feedbackid: number
}

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {

  feedbackIDText: String;
  userNameText: String;
  dateCompletedText: String;
  respondeeTypeText: String;
  respondeeText: String;
  feedbackTypeText: String;
  productText: String;
  callDurationText: String;

  answerIDText: String;
  
  answerFormValues : answerFormVals = {
    feedbackid: 0,
    questionid: 0,
    review: "",
    rating: null
  };

  feedbackid : feedbackid = {
    feedbackid: 0
  };

  postError = false;
  postErrorMessage = '';
  Defaults : Defaults;

  updateValues : updateValues = {
    respondeeid: null,
    productid: null,
    feedbacktypeid: null,
    datecompleted: "",
    conductor_id: null,
    callduration: "",
    respondeeTypeId: null,
    datesubmitted: "",
    feedbackid: "",
    meta_rating: null
  }

  successfulSubmit: boolean = false;

  responseInputComponentClass = ResponseInputComponent;

  constructor(private service: SharedService,
              private cdref: ChangeDetectorRef,
              private componentFactoryResolver : ComponentFactoryResolver,
              private router: Router) { 
                this.router.events.subscribe((ev) => {
                  if (ev instanceof NavigationEnd) { 
                    window.scroll(0,0);
                    this.getData();
                    this.child.getData();
                  }
                });
              }

  ngOnInit(): void {
    this.refreshFeedbackList();
    this.refreshQuestionList();
    this.cdref.detectChanges();
    this.addComponent(this.responseInputComponentClass);
  }

  FeedbackList: any=[];
  subFeedbackList: any[] = this.FeedbackList;
  QuestionList: any=[];
  subQuestionList: any[] = this.QuestionList;

  refreshFeedbackList(){
    this.service.getFeedbackList().subscribe(data=>{
      this.FeedbackList=data;
      this.subFeedbackList=data;
    });
  }

  refreshQuestionList(){
    this.service.getQuestionList().subscribe(data=>{
      this.QuestionList=data;
    });
  }

  //make sure that entered values correspond to an existing entry
  private requireFeedbackMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.FeedbackList && this.FeedbackList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }
  private requireQuestionMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.QuestionList && this.QuestionList.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }

  myControlFeedback = new FormControl(undefined, [Validators.required, this.requireFeedbackMatch.bind(this)]);
  myControlQuestion = new FormControl(undefined, [Validators.required, this.requireQuestionMatch.bind(this)]);

  onHttpError(errorResponse: any) {
    console.log('error:', HttpErrorResponse);
    this.postError = true;
    this.postErrorMessage = errorResponse.error.errorMessage;
  }

  onSubmit(form: NgForm){
    if (form.valid) {

      const feedbackid = Number(localStorage.getItem('currentFeedbackID'));
      console.log(feedbackid);

      if(this.myControl.value.feedbackid == undefined){
        this.answerFormValues.feedbackid = feedbackid;
      }
      else{
        this.answerFormValues.feedbackid = this.myControl.value.feedbackid;
      }

      this.checkValues();

      for (let index = 0; index < this.totalQuestions.length; index++) {
        const element = this.totalQuestions[index];
        this.answerFormValues.questionid = element.questionid;
        this.answerFormValues.review = element.response;
        this.answerFormValues.rating = element.rating;
        console.log(this.answerFormValues);

        this.service.addAnswer(this.answerFormValues).subscribe(
          result => this.answerIDText = (result.toString() + " "),
          error => this.onHttpError(error)
        );
      }

      this.successfulSubmit = true;
      window.scroll(0,0);

    }
    //Check for errors
    else {
      this.postError = true;
      this.postErrorMessage = "Please fix the above errors."
    }
  }

  testArray = <any>[];

  test2(){
    console.log(this.productText);
  }

  click(){
    var container = document.getElementById("question-list");
    var create = document.createElement('app-response-input');

    container.insertAdjacentElement('beforeend', create);
  }

  test(){
    const storedData = localStorage.getItem('myData');
    const parsedData = JSON.parse(storedData);
    const mapped = Object.keys(parsedData).map(key => ({type: key, value: parsedData[key]}));

    console.log(mapped);
  }

  getData() {
    const storedData = localStorage.getItem('myData');
    const parsedData = JSON.parse(storedData);
    const mapped = Object.keys(parsedData).map(key => ({type: key, value: parsedData[key]}));
    const durationString = (mapped[5].value);
    let durationVariable = moment(durationString, 'HH:mm:ss');
    let durationValue = durationVariable.format('HH:mm:ss');
    const feedbackId = localStorage.getItem('currentFeedbackID');


    //look into ngModel for this instead of touching the DOM
    if(mapped[0].value == null){
      this.respondeeText = "None";
    }
    else if(mapped[0].value == 0){
      this.respondeeText = "None";
    }
    else if(mapped[0].value != null){
      if(mapped[0].value.FullName != null){
        this.respondeeText = (mapped[0].value.FullName);
      }
      else if(mapped[0].value.CarrierName != null){
        this.respondeeText = (mapped[0].value.CarrierName);
      }
      else if(mapped[0].value.CustomerName != null){
        this.respondeeText = (mapped[0].value.CustomerName);
      }
    }
    this.userNameText = (mapped[4].value.FullName);
    this.dateCompletedText = (formatDate(mapped[3].value, 'MM/dd/YYYY', 'en-US'));
    this.respondeeTypeText = (mapped[6].value.respondee_type);
    this.feedbackTypeText = (mapped[2].value.feedback_name);
    this.productText = (mapped[1].value.product_name);
    if ( durationValue == "Invalid date"){
      this.callDurationText = "00:00:00";
    }
    else{
      this.callDurationText = (durationValue);
    }
    this.feedbackIDText = feedbackId;
 
    this.Defaults = parsedData;
   }
 
   removeData() {
     const storedData = localStorage.getItem('myData');
     localStorage.removeItem('myData');
   }

   myControl = new FormControl();

   displayFeedbackFn(FeedbackList) {
    return FeedbackList?.feedbackid;
  }
  FeedbackInputFn(event: KeyboardEvent): void {
    const filterValue = this.myControl.value.toString();
    const newArray = this.FeedbackList.map(x => x.feedbackid).filter(feedbackid => feedbackid.toString().includes(filterValue));
    
    //console.log(newArray);
    
    const filteredIndex = [];
  
    for (let index = 0; index < newArray.length; index++) {
      filteredIndex.push((this.getFilteredFeedbackVals(index)));
    };

    //console.log(filteredIndex);
    
    const filteredResults = [];

    for (let index = 0; index < filteredIndex.length; index++) {
      filteredResults.push(this.FeedbackList[filteredIndex[index]]);
    };
  
    this.subFeedbackList = filteredResults;
  }
  getFilteredFeedbackVals(index) {
    //get input value
    const filterValue = this.myControl.value.toString();
    //get all feedbackids in FeedbackList
    const array = this.FeedbackList.map(x => x.feedbackid);
    //get all feedbackids in FeedbackList have have the filter value in them
    const newArray = this.FeedbackList.map(x => x.feedbackid).filter(feedbackid => feedbackid.toString().includes(filterValue));

    //return the index of the row that has a value in newArray uding index as a parameter for the index of newArray
    //to fix my error I literally just removed ".toString()"
    return array.indexOf(newArray[index]);
  }

  async getFeedbackId(){
    const storedData = localStorage.getItem('currentFeedbackID');
    const parsedData = JSON.parse(storedData);

    return parsedData;
  }

  updateDisplayInfo(feedbackId: number){
    feedbackId = this.feedbackid.feedbackid;

    this.service.getFilteredFeedbackList(feedbackId).subscribe(data=>{
      const data2 = JSON.stringify(data);
      const data3 = JSON.parse(data2)[0];
      const trueData = Object.keys(data3).map(key => ({type: key, value: data3[key]}));

      this.updateValues.feedbackid = trueData[0].value;
      this.feedbackIDText = trueData[0].value;
      if(trueData[1].value == null){
        this.respondeeText = "None"
      }
      else{
        this.respondeeText = trueData[1].value;  
      }
      this.userNameText = trueData[3].value;
      this.dateCompletedText = formatDate(trueData[2].value, 'MM/dd/YYYY', 'en-US');
      this.respondeeTypeText = trueData[6].value;
      this.feedbackTypeText = trueData[4].value;
      this.productText = trueData[5].value;
      this.callDurationText = trueData[7].value;
    });
  }
  

  //https://stackoverflow.com/questions/44939878/dynamically-adding-and-removing-components-in-angular/48932243
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
  
  components = [];

  addComponent(componentClass: Type<any>){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    this.components.push(component);
  }

  removeComponent(componentClass: Type<any>){
    const component = this.components.find((component) => component.instance instanceof componentClass);
    const componentIndex = this.components.indexOf(component);

    const countComponents = document.querySelectorAll('#responseInputForm');

    if (countComponents.length !== 1){
      countComponents.item(countComponents.length-1).remove();
      this.components.pop();
      console.log(this.components);
    }
  }

  @ViewChild(ResponseInputComponent) child;

  totalQuestions = [];

  checkValues(){
    for (let index = 0; index < this.components.length; index++) {
      const element = this.components[index];
      const questionid = Object.keys(element.instance.responseInput).map(key => ({type: key, value: element.instance.responseInput.questionid[key]}))
      element.instance.responseInput.questionid = questionid[0]?.value;
      console.log(element.instance.responseInput);
      this.totalQuestions.push(element.instance.responseInput);
    }
  }

  hideSuccess(){
    this.successfulSubmit = false;
  }

  
}
