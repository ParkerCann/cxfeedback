import { Component, OnInit, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ValidationErrors, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {ChangeDetectorRef } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

interface Question {
  question_name: String;
}

interface responseInput {
  questionid: number,
  response: string,
  rating: number
}


@Component({
  selector: 'app-response-input',
  templateUrl: './response-input.component.html',
  styleUrls: ['./response-input.component.css']
})
export class ResponseInputComponent implements OnInit {

  question : Question = {
    question_name: ""
  }

  responseInput : responseInput = {
    questionid: null,
    response: "",
    rating: null
  }

  postError = false;
  postErrorMessage = '';

  constructor(private service: SharedService,
              private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.refreshFeedbackList();
    this.refreshQuestionList();
    this.cdref.detectChanges();
  }

  FeedbackList: any=[];
  subFeedbackList: any[] = this.FeedbackList;
  QuestionList: any=[];
  subQuestionList: any[] = this.QuestionList;

  refreshFeedbackList(){
    this.service.getFeedbackList().subscribe(data=>{
      this.FeedbackList=data;
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

  myControlQuestion = new FormControl(undefined, [Validators.required, this.requireQuestionMatch.bind(this)]);
  myControlResponse = new FormControl("", [Validators.required]);
  myControlRating = new FormControl("", [Validators.max(5), Validators.min(1), Validators.maxLength(1)]);


  displayQuestionName(QuestionList){
    return QuestionList?.question_name;
  }

  QuestionInputFn(event: KeyboardEvent): void {
    this.question.question_name = this.myControlQuestion.value;

    this.service.getFilteredQuestionList(this.question).subscribe(
      result => this.QuestionList = (result),
      error => console.log(error)
    );
  }

  ratingInputValidator(event: KeyboardEvent): void {
    if(this.myControlRating.status == "INVALID"){
      document.getElementById('responseInput').classList.add('invalid');
    }
    else if(this.myControlRating.status == "VALID"){
      document.getElementById('responseInput').classList.remove('invalid');
    }
  }

}
