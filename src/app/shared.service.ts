import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  CarrierSearchResults;

  readonly APIUrl="http://cxfeedbackservice.tql.com/api";
  //readonly APIUrl="http://localhost:54843/api";

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

  updateFeedback(val:any){
    return this.http.put(this.APIUrl+'/feedback', val)
  }

  // public getCarrierContactData(CarrierId: number): Observable<CarrierSearchResults[]> {
  //   return this.http.get<CarrierSearchResults[]>(environment.carrierSearchUrl + CarrierId);
  //   }
  
}


