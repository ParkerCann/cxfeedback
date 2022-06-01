import { Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { SurveySelectorComponent } from '../survey-selector/survey-selector.component';

export interface IdTextObj {
  id: number;
  text: string;
}

export interface questionAnswerObj {
  question_text: string;
  answer_text: string;
}

export interface responseObj{
  responseId: number;
  question_text: string;
  answer_text: string;
  date: string;
}

export interface responseObjWithFeedbackId{
  feedbackid: any;
  surveyMonkeyID: number;
  question_name: string;
  comment: string;
}

export interface rawResponseObj{
  response_id: number;
  question_id: number;
  answer: any;
  date: string;
}

export interface feedbackObj{
  response_id: number;
  datecompleted: string;
  alternate_first_name: string;
  alternate_last_name: string;
  affiliation: string;
}

export interface id_pairs{
  responseid: number;
  feedbackid: any;
}

@Component({
  selector: 'app-survey-monkey-calls',
  templateUrl: './survey-monkey-calls.component.html',
  styleUrls: ['./survey-monkey-calls.component.css']
})

export class SurveyMonkeyCallsComponent implements OnInit {

  @ViewChild(SurveySelectorComponent) sschild;

  constructor(private service: SharedService,
              public dialog: MatDialog) { }

  dataLayer;
    
  ngOnInit(): void {
    var dataLayer = dataLayer || [];
  }

  surveysObject;
  surveyDetailsObject;
  surveyIdArray: number[] = [];
  responsesObject;
  responseIdArray: number[] = [];
  surveyQuestionArray: IdTextObj[] = [];
  surveyAnswerArray: IdTextObj[] = [];
  responseObjArray: responseObj[] = [];
  databaseIdArray: number[] = [];
  rawResponseObject;
  rawResponseIdArray: rawResponseObj[] =[];
  dateArray: IdTextObj[] =[];
  feedbackObjArray: feedbackObj[] = [];

  //QID = Question ID
  firstName_QID: number;
  lastName_QID: number;
  affiliation_QID: number;
  keyQIDs:number[] = [];

  globalSurveyID:number = 0;

  toggleSpinner: boolean = false;

  status: string = 'Not Started'


  //main function that calls on the other functions to compile the data
  //timeouts are necesssary to prevent the APIs from overlapping and getting an error
  //should be using an async/await chain, but idk how
  getSurveyMonkeyData(){
    this.rawResponseIdArray=[];
    this.dateArray = [];
    this.responseIdArray = [];
    this.surveyQuestionArray = [];
    this.surveyAnswerArray= [];
    this.responseObjArray = [];
    this.databaseIdArray = [];
    this.surveyIdArray = [];

    this.getResponseIDsFromDB();
    setTimeout(() => this.getSurveyIds(), 1000);
    //setTimeout(() => this.logResponseIds(), 2000);
    setTimeout(() => this.getResponseDetails(), 3000);
    //setTimeout(() => this.logSurveyDetails(), 4000);
    setTimeout(() => this.combineQuestionids(), 5000);
    setTimeout(() => this.createFeedbackObj(), 6000);
  }

  //get all the survey ids associated with the user and push to the surveyIdArray
  async getSurveyIds(){
    try {
      this.surveysObject = await this.service.getSurveyIds();
      return new Promise(() => {
        for (let index = 0; index < this.surveysObject.data.length; index++) {
          const survey_id = this.surveysObject.data[index].id;
          this.surveyIdArray.push(survey_id);
        };
        this.surveyIdArray.push(1, 2, 3);
        this.status = 'Retrieved survey IDs';
        this.openDialog();
        console.log('done');  
      })
      
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
    
  }

  //get all the responses associated with a surveyid and push them to the responseIdArray
  async getResponseIds(survey_id:number){
    try {
      var data = await this.service.getResponseIds(survey_id);
      return new Promise(() => {
        this.responsesObject=data;
        for (let index = 0; index < this.responsesObject.__zone_symbol__value.data.length; index++) {
          var response_id: number = parseInt(this.responsesObject.__zone_symbol__value.data[index].id);
          if(this.alreadyExistingIDs.indexOf(response_id) !== -1){
          }
          else{
            this.responseIdArray.push(response_id);
          }
        }
        this.status = 'Retrieved response IDs';
        this.getSurveyDetails(survey_id);
      })
      
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
  }

  // //run the getResponseIds function for each survey that exists
  // logResponseIds(survey_id:number){
  //   try {
  //   this.getResponseIds(survey_id);
  //     this.status = 'Logged survey ID';  
  //   } catch (error) {
  //     console.log(error);
  //     this.status = 'Error';
  //   } 
  // }

  //gets the surveyDetails object (which has all the info on the survey), then runs the functions to manipulate that data
  async getSurveyDetails(survey_id:number){
    try {
      this.surveyDetailsObject = await this.service.getSurveyDetails(survey_id);
      console.log(this.surveyDetailsObject);
      return new Promise(() => {
        this.pushQuestionArray();
        this.pushAnswerArray();
        this.getResponseDetails();
        this.status = 'Retrieved survey details';    
      })
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
  }

  //gets all the question ids and text and pushes them to the surveyQuesionArray array
  pushQuestionArray(){
    for (let index = 0; index < this.surveyDetailsObject.pages[0].questions.length; index++) {
      const question_text = this.surveyDetailsObject.pages[0].questions[index].headings[0].heading;
      const question_id = this.surveyDetailsObject.pages[0].questions[index].id;
      var questionObj: IdTextObj = {text: question_text, id: question_id}
      if (questionObj.text == "First Name:") {
        this.firstName_QID = questionObj.id;
        this.keyQIDs.push(questionObj.id);
      }
      else if(questionObj.text == "Last Name:"){
        this.lastName_QID = questionObj.id;
        this.keyQIDs.push(questionObj.id);
      }
      else if(questionObj.text == "Affiliation:"){
        this.affiliation_QID = questionObj.id;
        this.keyQIDs.push(questionObj.id);
      }
      this.surveyQuestionArray.push(questionObj);
    }
  }

  //gets all the answer ids and text and pushes them to the surveyAnswerArray array
  pushAnswerArray(){
    for (let i = 0; i < this.surveyQuestionArray.length; i++) {
      for (let index = 0; index < this.surveyDetailsObject.pages[0].questions[i].answers?.choices.length; index++) {
        const ansText = this.surveyDetailsObject.pages[0].questions[i]?.answers.choices[index].text;
        const ansId = this.surveyDetailsObject.pages[0].questions[i]?.answers.choices[index].id;
        //need some null checker to prevent it from reading for "answers" on the comment box
        var answerObj: IdTextObj = {text: ansText, id: ansId};
        this.surveyAnswerArray.push(answerObj);
      }
    }
  }

  //gets all the response details and creates the object with response id, question id, answer, and date
  async getResponseDetails(){
    try {
      for (let i = 0; i < this.surveyIdArray.length; i++) {
        for (let index = 0; index < this.responseIdArray.length; index++) {
          var data = await this.service.getResponseDetails(this.surveyIdArray[i], this.responseIdArray[index]);
          return new Promise(() => {
            this.rawResponseObject=data;
              for (let qindex = 0; qindex < this.rawResponseObject.pages[0].questions.length; qindex++) {
                const questionid = this.rawResponseObject.pages[0].questions[qindex].id;
                var answer = this.rawResponseObject.pages[0].questions[qindex].answers[0].choice_id;
                if(this.rawResponseObject.pages[0].questions[qindex].answers[0].choice_id == undefined){
                  answer = this.rawResponseObject.pages[0].questions[qindex].answers[0]?.text;
                }
                const date = this.rawResponseObject.date_created

                const responseIdsObject: rawResponseObj = {response_id: this.responseIdArray[index], question_id: questionid, answer: answer, date: date};
                this.rawResponseIdArray.push(responseIdsObject);

                const dateIdObj: IdTextObj = {id: this.responseIdArray[index], text: date}
                this.dateArray.push(dateIdObj);
            }
          })
        }
      }
    this.status = 'Retrieved response details';
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
  }

  idInfo: responseObj[] = [];

  //creates the final object with the response id, question text, answer text, and date - then pushes the object to the resposneObjArray
  combineQuestionids(){
    try {
      for (let index = 0; index < this.rawResponseIdArray.length; index++) {
        const element = this.rawResponseIdArray[index];
        const questionObj = this.surveyQuestionArray.find(x => x.id === element.question_id)
        const questionTxt = questionObj.text;
        if(this.keyQIDs.includes(this.rawResponseIdArray[index].question_id)){
          const idObj: responseObj = {responseId: element.response_id, question_text: questionTxt , answer_text: element.answer, date: element.date}
          this.idInfo.push(idObj)
        }
        else{
          const answerObj = this.surveyAnswerArray.find(x => x.id === element.answer)
          var answerTxt = answerObj?.text;
          if (answerObj == undefined) {
            answerTxt = element?.answer;
          }
          const quesAnsObj: responseObj = {responseId: element.response_id, question_text: questionTxt, answer_text: answerTxt, date: element.date};
          this.responseObjArray.push(quesAnsObj);  
        }
      }
      this.status = 'Creating table...';
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
  }

  //also need a function to submit the entry into the feedback table first, retrieve the feedback id (1 per response), then use that feedback id to insert the
  //rows into the teamFeedback table

  createFeedbackObj(){
    //console.log(this.responseObjArray)
    for (let index = 0; index < this.responseIdArray.length; index++) {
      const responseID = this.responseIdArray[index];
      
      const testObj = this.idInfo.find(x => x.responseId);
      const fNameObj = this.idInfo.find(x => x.responseId == responseID && x.question_text == "First Name:");
      const lNameObj = this.idInfo.find(x => x.responseId == responseID && x.question_text == "Last Name:");
      const affilObj = this.idInfo.find(x => x.responseId == responseID && x.question_text == "Affiliation:");

      const date = testObj.date;
      var fname: string = fNameObj?.answer_text.replace(/\s/g, "");
      var lname: string = lNameObj?.answer_text.replace(/\s/g, "");
      var affil: string = affilObj?.answer_text.replace(/\s/g, "");

      //I don't really need the id here, since these objects are being sent into the Feedback table first, then the objects in the responseObjArray are sent into the tblTeamReviews
      const feedbackObj:feedbackObj = {response_id: responseID, datecompleted: date, alternate_first_name: fname, alternate_last_name: lname, affiliation: affil};
      console.log(feedbackObj);
      this.feedbackObjArray.push(feedbackObj);
    }
    if(this.feedbackObjArray.length == 0){
      this.status = 'No new data available.';
    }
    else{
      this.status = 'Complete';
      this.uploadStatus = 'Ready';
      this.tblVisibility = true;
    }
  }

  fakeResponseID: number;
  uploadStatus: string = 'Not Started';

  responseId_feedbackId = [];

  //need a function to pull all the response ids from the database to prevent duplicates from being uploaded (or could do the latest date created and 
  //only use the dates that appear after that(in that case, will need the exact time of the creation for entries created on the same day))

  //could query distinct ids, put them in an array, then if that array includes the object's response id, skip that one when uploading (or do this earlier in the process)
  alreadyExistingIDs: number[] = [];

  async getResponseIDsFromDB(){
    var result = await this.service.getSurveyMonkeyIDs();
    return new Promise(() => {
      {for (let index = 0; index < result._subscribe.length; index++) {
          var element:number = result[index].surveyMonkeyID;
          this.alreadyExistingIDs.push(element);
        }
      }  
    })
      
  }
  
  //can post a row into the feedback tbl with the feedbackObj result from "createFeedbackObj" that has date/name/affil, then use the resulting feedback id to add to the rows posted into the tblTeamReviews
  uploadFeedbackEntries(){
    try {
      this.uploadStatus = 'Uploading into Feedback table..';
      for (let index = 0; index < this.feedbackObjArray.length; index++) {
        const element = this.feedbackObjArray[index];
        var id_pair: id_pairs;
        //only posts into the feedback tbl
        this.service.postTeamReviewFeedback(element).subscribe(result => this.responseId_feedbackId.push(id_pair = {feedbackid: result, responseid: element.response_id}));
      }
      this.uploadStatus = 'Uploading into Feedback table...';
    } catch (error) {
      console.log(error);
      this.uploadStatus = 'Error';
    }
  }

  uploadAnswerEntries(){
    try {
      for (let index = 0; index < this.responseObjArray.length; index++) {
        const element = this.responseObjArray[index];
        for (let i = 0; i < this.responseId_feedbackId.length; i++) {
          var e = this.responseId_feedbackId[i].responseid;
          var f: number = this.responseId_feedbackId[i].feedbackid;
          if (element.responseId == e) {
            var row: responseObjWithFeedbackId = {feedbackid: f, question_name: element.question_text, comment: element.answer_text, surveyMonkeyID: element.responseId};
            //console.log(row);
            this.service.postTeamReviewAnswers(row).subscribe();
          }
        }
      }
      this.uploadStatus = 'Uploading into tblTeamReviews...';
    } catch (error) {
      this.uploadStatus = 'Error';
      console.log(error);
    }
  }

  compositeUploadFunction(){
    this.uploadStatus = 'Uploading into Feedback table.';
    this.uploadFeedbackEntries();
    setTimeout(() => this.uploadAnswerEntries(), 1000);
    setTimeout(() => this.uploadStatus = "Upload Complete", 2500);
  }

  tblVisibility = false;

  async openDialog(){
    const dialogRef = await this.dialog.open(SurveySelectorComponent, {data: this.surveyIdArray});

    dialogRef.afterClosed().subscribe(result => {
      this.globalSurveyID = result;
      this.dataLayer.push({
        'event': 'surveySelected',
        'surveyID': result
      })
      this.getResponseIds(result)
    });
  }

  attemptOnAsync(){
    this.getSurveyIds();
    //this.getResponseIds(this.globalSurveyID);
  }
}

export interface DialogData{
  survey_id: number;
}