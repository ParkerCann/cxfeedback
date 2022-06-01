import { Component, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { ResponseInputComponent } from '../answer-form/response-input/response-input.component';

@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.css']
})

export class ImportPageComponent {

  responseInputComponentClass = ResponseInputComponent;

  @Input() addComponent: any;

  csvRecords: any[] = [];
  header = true;

  numQuestions: number;

  keys = []
  keysLength = 1;
  data = []
  dataLength = 1;


  showCont: boolean = false;

  constructor(private ngxCsvParser: NgxCsvParser) {
  }

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

  //https://www.npmjs.com/package/ngx-csv-parser
  // Your applications input change listener for the CSV File
  fileChangeListener(file: any): void {

    if(file != undefined){
      if(this.numQuestions == 0){
        console.log("need 1 or more questions")
      }
      else{
        // Select the files from the event
        //const files = $event.srcElement.files;

        // Parse the file you want to select for the operation along with the configuration
        this.ngxCsvParser.parse(file[0], { header: this.header, delimiter: ',' })
          .pipe().subscribe((result: Array<any>) => {

            //console.log('Result', result);
            this.csvRecords = result;
            for (let i = 0; i < result.length; i++) {
              const key = Object.keys(result[i]);
              const val = Object.values(result[i]);
              this.keys.push(key)
              this.data.push(val)
            }
            this.keysLength = this.keys[0].length
            this.dataLength = this.data[0].length
            this.showCont = true;
          }, (error: NgxCSVParserError) => {
            console.log('Error', error);
          });   
      }
       
    }
    else if(file == undefined){
      console.log("No file selected")
    }
  }

  file: any; 
  filename = ""

  onDragOver(event) {
    event.preventDefault();
  }

  // From drag and drop
  onDropSuccess(event) {
      event.preventDefault();

      this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  // From attachment link
  onChange(event) {
      this.onFileChange(event.target.files);    // "target" is correct here
  }

  private onFileChange(files: File[]) {
    this.file = files;
    this.filename = files[0].name;
    console.log(files)
  }

  //value used to determine which of the csvRecords you want to pull from
  selectedData = 0;
  displayData = this.selectedData + 1;

  getRowId($event){
    //uses the "event" (meaning whichever row you clicked) to get that row's id, which is linked to its place in the array in the html
    //path[1] refers it to the id of the element, and id[3] gets the character in the 3rd place of that id
    this.selectedData = $event.path[1].id[3]
    this.displayData = parseInt($event.path[1].id[3]) + 1;
  }

  reset(){
    this.displayData = 1;
    this.selectedData = 0;
    this.csvRecords = [];
    this.numQuestions = null;
    this.filename = ""
  }

  openTut(){
    const URL = "https://docs.google.com/document/d/19k0DzmtmoIG9caLEQjHpQiimN99gkvbreCMyOsPwYp0/edit?usp=sharing";    
    window.open(URL, null); 
  }

}