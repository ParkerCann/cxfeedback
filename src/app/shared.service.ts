import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  CarrierSearchResults;

  readonly APIUrl="http://cxfeedbackservice.tql.com/api";
  //readonly APIUrl="http://localhost:54843/api";
  readonly surveyMonkeyAPI_URL="https://api.surveymonkey.net/v3";

  constructor(private http:HttpClient) { }

  getQuestionList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/question');
  }

  getFeedbackTypeList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/feedbacktype');
  }

  getRespondeeTypeList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/respondeetype');
  }

  getProductList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/product');
  }

  getEmployeeIDsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/employeeids');
  }

  getFeedbackList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/feedback');
  }

  getDetailedFeedbackList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/detailedfeedback');
  }

  getCarrierList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/carrier');
  }

  getCustomerList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/customer');
  }

  getEmployeeList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/employee');
  }

  getDateList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/datecompleted');
  }

  getFilteredEmployeeList(val:any){
    return this.http.post(this.APIUrl+'/employee', val)
  }

  getFilteredCustomerList(val:any){
    return this.http.post(this.APIUrl+'/customer', val)
  }

  getFilteredCarrierList(val:any){
    return this.http.post(this.APIUrl+'/carrier', val)
  }

  getFilteredFeedbackList(val:any){
    return this.http.post(this.APIUrl+'/filteredfeedbackid', val)
  }

  getFilteredQuestionList(val:any){
    return this.http.post(this.APIUrl+'/question', val)
  }

  getFilteredAnswerList(val:any){
    return this.http.post(this.APIUrl+'/filteredanswer', val)
  }

  addFeedback(val:any){
    return this.http.post(this.APIUrl+'/feedback', val)
  }

  addAnswer(val:any){
    return this.http.post(this.APIUrl+'/answer', val)
  }

  addcxfeebackAnswer(val:any){
    return this.http.post(this.APIUrl+'/cxfeedbackanswers', val);
  }

  updateFeedback(val:any){
    return this.http.put(this.APIUrl+'/feedback', val)
  }

  //API Calls for SurveyMonkey

  auth_token = 'ALSBHlApBbU8OQHslBMe0csS4BySIGk7phSEJavKg2YyPgIuTl4Ve0UUFZ58xgCFgcXN9gWkDernadw.6G.oWyUm1kEd5iJMUsBta.lM9FY1A9Y-hYynWu4HkLdLhrr3';

  header = new HttpHeaders({
    'Content-Type': 'Accept: application/json',
    'Authorization': `Bearer ${this.auth_token}`
  })

  async getSurveyIds():Promise<Observable<any[]>>{
    var result = this.http.get<any>(this.surveyMonkeyAPI_URL+'/surveys', {headers: this.header}).toPromise();
    return result;
  }

  async getResponseIds(survey_id:number):Promise<Observable<any[]>>{
    var result = this.http.get<any>(this.surveyMonkeyAPI_URL+'/surveys/' + survey_id + '/responses', {headers: this.header}).toPromise();
    return result;
  }

  async getSurveyDetails(survey_id:number):Promise<Observable<any[]>>{
    var result = this.http.get<any>(this.surveyMonkeyAPI_URL+'/surveys/' + survey_id + '/details', {headers: this.header}).toPromise();
    return result;
  }

  async getResponseDetails(survey_id:number, response_id:number):Promise<Observable<any[]>>{
    var result = this.http.get<any>(this.surveyMonkeyAPI_URL+'/surveys/' + survey_id + '/responses/' + response_id + '/details', {headers: this.header}).toPromise();
    return result;
  }

  async postTeamReviewFeedback(val:any){
    var result = await this.http.post(this.APIUrl+'/teamreviewfeedback', val).toPromise();
    return result as [];
  }

  postTeamReviewAnswers(val:any){
    return this.http.post(this.APIUrl+'/teamreviewanswer', val);
  }

  json_headers={
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}

async getSurveyMonkeyIDs():Promise<Observable<any[]>>{
    return this.http.get<any>(this.APIUrl+'/getsurveymonkeyids', this.json_headers).toPromise();
  }
  
}