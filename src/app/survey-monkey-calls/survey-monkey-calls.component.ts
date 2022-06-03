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
    
  ngOnInit(): void {
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
  async getSurveyMonkeyData(){
    this.rawResponseIdArray=[];
    this.dateArray = [];
    this.responseIdArray = [];
    this.surveyQuestionArray = [];
    this.surveyAnswerArray= [];
    this.responseObjArray = [];
    this.databaseIdArray = [];
    this.surveyIdArray = [];
    this.globalSurveyID = undefined;
    this.status = 'Not Started';
    this.tblVisibility = false;

    var dbResponseReceived = await this.getResponseIDsFromDB();
    if(dbResponseReceived){
      this.getSurveyIds();  
    }
    
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
        this.status = 'Retrieved survey IDs';
        this.openDialog();
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
        for (let index = 0; index < this.responsesObject.data.length; index++) {
          var response_id: number = parseInt(this.responsesObject.data[index].id);
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

  //composite function that organizes and pushes the questions and answers with their corresponding IDs to their respective arrays
  //then retrieves the response details using the survey id and response 
  async getSurveyDetails(survey_id:number){
    try {
      this.surveyDetailsObject = await this.service.getSurveyDetails(survey_id);
      return new Promise(async() => {
        var f1 = await this.pushQuestionArray();
        if(f1 = true){
          var f2 = await this.pushAnswerArray();
          if(f2 = true){
            var f3 = await this.getResponseDetails();
            this.status = 'Retrieved response details';
            if(f3 = true){
              var f4 = await this.combineQuestionids();
              this.status = 'Creating table...';
              if(f4 = true){
                this.createFeedbackObj();
              }
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
  }

  //gets all the question ids and text and pushes them to the surveyQuesionArray array
  pushQuestionArray(){
    try{
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
      return true
    }
    catch(error){
      console.log(error);
      this.status = "Error";
    }
    
  }

  //gets all the answer ids and text and pushes them to the surveyAnswerArray array
  pushAnswerArray(){
    try {
      for (let i = 0; i < this.surveyQuestionArray.length; i++) {
        for (let index = 0; index < this.surveyDetailsObject.pages[0].questions[i].answers?.choices.length; index++) {
          const ansText = this.surveyDetailsObject.pages[0].questions[i]?.answers.choices[index].text;
          const ansId = this.surveyDetailsObject.pages[0].questions[i]?.answers.choices[index].id;
          //need some null checker to prevent it from reading for "answers" on the comment box
          var answerObj: IdTextObj = {text: ansText, id: ansId};
          this.surveyAnswerArray.push(answerObj);
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
    
  }

  //gets all the response details and creates the object with response id, question id, answer, and date
  async getResponseDetails(){
    try {
      var i = this.globalSurveyID;
      for (let index = 0; index < this.responseIdArray.length; index++) {
        var data = await this.service.getResponseDetails(i, this.responseIdArray[index]);
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
      }
      return true;
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
          const idObj: responseObj = {responseId: element.response_id, question_text: questionTxt, answer_text: element.answer, date: element.date};
          
          this.idInfo.push(idObj);
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
      return true;
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    }
  }

  //runs a function that creates the Object that's sent to the feedback db. Pulls the fname, lname, affil, and date to add to that entry
  createFeedbackObj(){
    for (let index = 0; index < this.responseIdArray.length; index++) {
      const responseID = this.responseIdArray[index];

      const fNameObj = this.idInfo.find(x => x.responseId == responseID && x.question_text == "First Name:");
      const lNameObj = this.idInfo.find(x => x.responseId == responseID && x.question_text == "Last Name:");
      const affilObj = this.idInfo.find(x => x.responseId == responseID && x.question_text == "Affiliation:");
      const date = this.responseObjArray.find(x => x.responseId).date;
      var fname: string = fNameObj?.answer_text.replace(/\s/g, "");
      var lname: string = lNameObj?.answer_text.replace(/\s/g, "");
      var affil: string = affilObj?.answer_text.replace(/\s/g, "");

      //I don't really need the id here, since these objects are being sent into the Feedback table first, then the objects in the responseObjArray are sent into the tblTeamReviews
      const feedbackObj:feedbackObj = {response_id: responseID, datecompleted: date, alternate_first_name: fname, alternate_last_name: lname, affiliation: affil};
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

  //String that contains the status of the upload function.
  uploadStatus: string = 'Not Started';

  //array that pairs the responseID with the FeedbackID
  responseId_feedbackId = [];

  //stores the result of the function (being the existing IDs), for whatever reason must be stored outside the function before trying to as for .length
  getSurveyMonkeyIDsResult;
  //array to store the already existing Response IDs within the database
  alreadyExistingIDs: number[] = [];

  //function to get already existing IDs from the database
  async getResponseIDsFromDB(){
    try {
      this.getSurveyMonkeyIDsResult = await this.service.getSurveyMonkeyIDs();
      for (let index = 0; index < this.getSurveyMonkeyIDsResult.length; index++) {
          var element:number = this.getSurveyMonkeyIDsResult[index].surveyMonkeyID;
          this.alreadyExistingIDs.push(element);
        }
      return true;  
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  //can post a row into the feedback tbl with the feedbackObj result from "createFeedbackObj" that has date/name/affil, then use the resulting feedback id to add to the rows posted into the tblTeamReviews
  async uploadFeedbackEntries(){
    try {
      this.uploadStatus = 'Uploading into Feedback table..';
      for (let index = 0; index < this.feedbackObjArray.length; index++) {
        const element = this.feedbackObjArray[index];
        var id_pair: id_pairs;
        //only posts into the feedback tbl
        var result = await this.service.postTeamReviewFeedback(element);
        this.responseId_feedbackId.push(id_pair = {feedbackid: result, responseid: element.response_id});
      }
      return true;
    } catch (error) {
      console.log(error);
      this.uploadStatus = 'Error';
    }
  }

  //upload the answers into tblTeamReviews
  uploadAnswerEntries(){
    try {
      for (let index = 0; index < this.responseObjArray.length; index++) {
        const element = this.responseObjArray[index];
        for (let i = 0; i < this.responseId_feedbackId.length; i++) {
          var e = this.responseId_feedbackId[i].responseid;
          var f: number = this.responseId_feedbackId[i].feedbackid;
          if (element.responseId == e) {
            var row: responseObjWithFeedbackId = {feedbackid: f, question_name: element.question_text, comment: element.answer_text, surveyMonkeyID: element.responseId};
            this.service.postTeamReviewAnswers(row).subscribe();
          }
        }
      }
      return true;
    } catch (error) {
      this.uploadStatus = 'Error';
      console.log(error);
    }
  }

  //combines the feedback and answer upload functions
  async compositeUploadFunction(){
    this.uploadStatus = 'Uploading into Feedback table.';
    var uploadFeedbackSuccess = await this.uploadFeedbackEntries();
    if(uploadFeedbackSuccess){
      this.uploadStatus = 'Uploading into tblTeamReviews...';
      var uploadAnswerSucess = await this.uploadAnswerEntries();
      if(uploadAnswerSucess){
        this.uploadStatus = "Upload Complete"
      }
    }
  }

  //bool to toggle the tbl visibility
  tblVisibility = false;

  //function that opens the modal for the ID selection
  async openDialog(){
    const dialogRef = await this.dialog.open(SurveySelectorComponent, {data: this.surveyIdArray});

    dialogRef.afterClosed().subscribe(result => {
      this.globalSurveyID = result;
      this.getResponseIds(result);
    });
  }
}

//creates an interface to store the survey_id from the openDialog() function
export interface DialogData{
  survey_id: number;
}