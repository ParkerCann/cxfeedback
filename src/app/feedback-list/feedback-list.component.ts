import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { updateValues, UserSettingsFormComponent } from '../user-settings-form/user-settings-form.component';


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

export interface answerVals {
  question_name: string,
  review: string,
  rating: number
}

export interface answerValDetails {
  [key: number]: answerVals;
}

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('250ms ease')),
  ]),
  ],
})

export class FeedbackListComponent implements OnInit {

  columnsToDisplay_header: string[] = ['Feedback ID', 
  'Completed By', 
  'Date Completed', 
  'Feedback Type', 
  'Product', 
  'Respondee Type', 
  'Respondee'];

  columnsToDisplay: string[] = ['feedbackid', 
  'Fullname', 
  'datecompleted', 
  'feedback_name', 
  'product_name', 
  'respondee_type', 
  'RespondeeName'];

  displayedColumnsKeys: string[];
  displayedColumns= [
    {
      key: 'feedbackid',
      header: 'Feedback ID'
    },
    {
      key: 'Fullname',
      header: 'Completed By'
    },
    {
      key: 'datecompleted',
      header: 'Date Completed'
    },
    {
      key: 'feedback_name',
      header: 'Feedback Type'
    },
    {
      key: 'product_name',
      header: 'Product'
    },
    {
      key: 'respondee_type',
      header: 'Respondee Type'
    },
    {
      key: 'RespondeeName',
      header: 'Respondee'
    }
  ];

  expandedFeedback: answerValDetails | null;

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
    this.displayedColumnsKeys = this.displayedColumns.map(col => col.key);
  }

  isUser: boolean = false;
  isProd: boolean = false;
  isDate: boolean = false;
  isFeedType: boolean = false;
  isRespType: boolean = false;
  chosenFilter: boolean = false;

  retrievedAnswers: any = [];
  retrievedAnswersDefaults: answerVals = {
    question_name: "N/A",
    review: "",
    rating: null
  }


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
      this.subFeedbackList = data;
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

      console.log(this.subFeedbackList[0]);

      if(this.subFeedbackList[0] == undefined){
        this.noResults = true;
      }
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

      if(this.subFeedbackList[0] == undefined){
        this.noResults = true;
      }
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

      if(this.subFeedbackList[0] == undefined){
        this.noResults = true;
      }
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

      if(this.subFeedbackList[0] == undefined){
        this.noResults = true;
      }
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

      if(this.subFeedbackList[0] == undefined){
        this.noResults = true; 
      }
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
    this.filters.completedBy = "";
    this.isProd = false;
    this.filters.product = "";
    this.isRespType = false;
    this.filters.respondeeType = "";
    this.isDate = false;
    this.filters.dateCompleted = "";
    this.isFeedType = false;
    this.filters.feedbackType = "";
  }

  myControlUser = new FormControl();
  myControlProduct = new FormControl();
  myControlDate = new FormControl();
  myControlFeedType = new FormControl();
  myControlRespType = new FormControl();
  noResults: boolean = false;


  viewAnswers(feedbackid: number){
    this.retrievedAnswers = [];

    if(feedbackid !== null){
      this.service.getFilteredAnswerList(feedbackid).subscribe(
        result => {
        if(result == ''){
          this.retrievedAnswers.push(this.retrievedAnswersDefaults);
          console.log("empty");
        }
        else {
          for (let index = 0; index < Object.keys(result).length; index++) {
            const element = result[index];
            this.retrievedAnswers.push(element);
          }
        }},
        error => console.log(error)
      );
    }
    else if(feedbackid == null){
      console.log("Feedbackid is null");
    } 
  }

  viewAllAnswers(){
    const answerList = [];

    for (let index = 0; index < this.FeedbackList.length; index++) {
      const element = this.FeedbackList[index];
      this.service.getFilteredAnswerList(element).subscribe(
        result => this.retrievedAnswers.push(result),
        error => console.log(error)
      );
    }
    console.log(this.retrievedAnswers);

    //make it so that [i] of this.retrievedAnswers = column[i]'s collapsed values
  }

  test(){
    //this.viewAllAnswers();
    console.log(document.getElementsByClassName('ng-trigger-detailExpand'));
  }

  allRowsExpanded: boolean = false;

  public toggle() {
    this.allRowsExpanded = !this.allRowsExpanded;
    this.expandedFeedback = null;
  }

  //function will group all feedback by their ids (idk why I did this. I needed Answers and I already did that above)
  groupFeedback(){
    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    var groupedList = (groupBy(this.FeedbackList, 'feedbackid'));

    var groupedListKeys = (Object.keys(groupedList));

    for (let index = 0; index < groupedListKeys.length; index++) {
      const element = groupedListKeys[index];
      const ele = groupedList[element];
      console.log(ele);
    }
  }
}
