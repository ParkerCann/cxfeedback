import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';


export interface origFilt {
  selectedVal: string
}

export interface filters {
  completedBy: string,
  product: string,
  dateCompleted: string,
  feedbackType: string,
  respondeeType: string
}

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

  filters : filters = {
    completedBy: "",
    product: "",
    dateCompleted: "",
    feedbackType: "",
    respondeeType: ""
  };
  origFilt : origFilt = {selectedVal: ""};

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    //window.location.reload();
    this.refreshDetailedFeedbackList();
    this.refreshProdList();
    this.refreshEmployeeIDList();
    this.refreshRespondeeTypeList();
    this.refreshFeedbackTypeList();
    this.refreshDateList();

    setTimeout(() => {
      this.fillSubFeedbackList();
    }, 1000);
  }

  isUser: boolean = false;
  isProd: boolean = false;
  isDate: boolean = false;
  isFeedType: boolean = false;
  isRespType: boolean = false;
  chosenFilter: boolean = false;


  chgFilt(){
    if( this.origFilt.selectedVal == this.typeOfFilter[0]){
      this.isUser = true;
      this.isProd = false;
      this.isRespType = false;
      this.isDate = false;
      this.isFeedType = false;
    }
    else if( this.origFilt.selectedVal == this.typeOfFilter[1]){
      this.isUser = false;
      this.isProd = true;
      this.isRespType = false;
      this.isDate = false;
      this.isFeedType = false;
    }
    else if( this.origFilt.selectedVal == this.typeOfFilter[2]){
      this.isUser = false;
      this.isProd = false;
      this.isRespType = false;
      this.isDate = true;
      this.isFeedType = false;
    }
    else if( this.origFilt.selectedVal == this.typeOfFilter[3]){
      this.isUser = false;
      this.isProd = false;
      this.isRespType = false;
      this.isDate = false;
      this.isFeedType = true;
    }
    else if( this.origFilt.selectedVal == this.typeOfFilter[4]){
      this.isUser = false;
      this.isProd = false;
      this.isRespType = true;
      this.isDate = false;
      this.isFeedType = false;
    }
  }

  typeOfFilter: any=[
    "Completed By",
    "Product",
    "Date Completed",
    "Feedback Type",
    "Respondee Type"
  ];

  FeedbackList: any=[];
  subFeedbackList: any[];
  ProductList:any=[];
  EmployeeIDsList:any=[];
  RespondeeTypeList:any=[];
  FeedbackTypeList: any=[];
  DateList: any=[];

  refreshDetailedFeedbackList(){
    this.service.getDetailedFeedbackList().subscribe(data=>{
      this.FeedbackList=data;
    });
  }
  fillSubFeedbackList(){
    console.log("Loaded");
    this.subFeedbackList = this.FeedbackList;
  }

  refreshProdList(){
    this.service.getProductList().subscribe(data=>{
      this.ProductList=data;
    });
  }
  refreshEmployeeIDList(){
    this.service.getEmployeeIDsList().subscribe(data=>{
      this.EmployeeIDsList=data;
    });
  }
  refreshRespondeeTypeList(){
    this.service.getRespondeeTypeList().subscribe(data=>{
      this.RespondeeTypeList=data;
    });
  }
  refreshFeedbackTypeList(){
    this.service.getFeedbackTypeList().subscribe(data=>{
      this.FeedbackTypeList=data;
    });
  }
  refreshDateList(){
    this.service.getDateList().subscribe(data=>{
      this.DateList=data;
    });
  }

  filter(){

    if(this.origFilt.selectedVal == this.typeOfFilter[0]){
      this.subFeedbackList = [];

      var wholeArray = [];

      for (let index = 0; index < this.myControlUser.value.length; index++) {
        const element = this.myControlUser.value[index];
        const newArray = this.FeedbackList.filter(x => x.Fullname.includes(element));        
        wholeArray.push(newArray);
      }

      var displayArray = [];

      for (let arrayNumber = 0; arrayNumber < wholeArray.length ; arrayNumber++) {
        for (let arrayRow = 0; arrayRow < wholeArray[arrayNumber].length ; arrayRow++) {
          const element = wholeArray[arrayNumber][arrayRow];
          displayArray.push(element);
        }
      }

      var sortArray = displayArray.sort((a,b) => b.feedbackid - a.feedbackid);

      this.subFeedbackList = sortArray;
    }

    else if(this.origFilt.selectedVal == this.typeOfFilter[1]){
      this.subFeedbackList = [];

      var wholeArray = [];

      for (let index = 0; index < this.myControlProduct.value.length; index++) {
        const element = this.myControlProduct.value[index];
        const newArray = this.FeedbackList.filter(x => x.product_name.includes(element));
        wholeArray.push(newArray);
      }

      var displayArray = [];

      for (let arrayNumber = 0; arrayNumber < wholeArray.length ; arrayNumber++) {
        for (let arrayRow = 0; arrayRow < wholeArray[arrayNumber].length ; arrayRow++) {
          const element = wholeArray[arrayNumber][arrayRow];
          displayArray.push(element);
        }
      }

      var sortArray = displayArray.sort((a,b) => b.feedbackid - a.feedbackid);

      this.subFeedbackList = sortArray;
    }

    else if(this.origFilt.selectedVal == this.typeOfFilter[2]){

      this.subFeedbackList = [];

      var wholeArray = [];

      for (let index = 0; index < this.myControlDate.value.length; index++) {
        const element = this.myControlDate.value[index];
        const newArray = this.FeedbackList.filter(x => x.datecompleted.includes(element));
        wholeArray.push(newArray);
      }

      var displayArray = [];

      for (let arrayNumber = wholeArray.length - 1; arrayNumber > -1 ; arrayNumber--) {
        for (let arrayRow = 0; arrayRow < wholeArray[arrayNumber].length ; arrayRow++) {
          const element = wholeArray[arrayNumber][arrayRow];
          displayArray.push(element);
        }
      }

      var sortArray = displayArray.sort((a,b) => b.feedbackid - a.feedbackid);

      this.subFeedbackList = sortArray;
    }

    else if(this.origFilt.selectedVal == this.typeOfFilter[3]){
      this.subFeedbackList = [];

      var wholeArray = [];

      for (let index = 0; index < this.myControlFeedType.value.length; index++) {
        const element = this.myControlFeedType.value[index];
        const newArray = this.FeedbackList.filter(x => x.feedback_name.includes(element));
        wholeArray.push(newArray);
      }

      var displayArray = [];

      for (let arrayNumber = wholeArray.length - 1; arrayNumber > -1 ; arrayNumber--) {
        for (let arrayRow = 0; arrayRow < wholeArray[arrayNumber].length ; arrayRow++) {
          const element = wholeArray[arrayNumber][arrayRow];
          displayArray.push(element);
        }
      }

      var sortArray = displayArray.sort((a,b) => b.feedbackid - a.feedbackid);

      this.subFeedbackList = sortArray;
    }
    else if(this.origFilt.selectedVal == this.typeOfFilter[4]){
      this.subFeedbackList = [];

      var wholeArray = [];

      for (let index = 0; index < this.myControlRespType.value.length; index++) {
        const element = this.myControlRespType.value[index];
        const newArray = this.FeedbackList.filter(x => x.respondee_type.includes(element));
        wholeArray.push(newArray);
      }

      var displayArray = [];

      for (let arrayNumber = wholeArray.length - 1; arrayNumber > -1 ; arrayNumber--) {
        for (let arrayRow = 0; arrayRow < wholeArray[arrayNumber].length ; arrayRow++) {
          const element = wholeArray[arrayNumber][arrayRow];
          displayArray.push(element);
        }
      }

      var sortArray = displayArray.sort((a,b) => b.feedbackid - a.feedbackid);

      this.subFeedbackList = sortArray;
    }
  }

  enableFilters(){
    this.chosenFilter = true;
  }

  clearFilters(){
    this.subFeedbackList = this.FeedbackList;
    this.chosenFilter = false;
    this.origFilt.selectedVal = "";
    this.isUser = false;
    this.isProd = false;
    this.isRespType = false;
    this.isDate = false;
    this.isFeedType = false;
  }

  myControlUser = new FormControl();
  myControlProduct = new FormControl();
  myControlDate = new FormControl();
  myControlFeedType = new FormControl();
  myControlRespType = new FormControl();

}
