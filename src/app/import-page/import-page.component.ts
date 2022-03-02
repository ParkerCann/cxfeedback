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
  data = []

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

            console.log('Result', result);
            this.csvRecords = result;
            this.keys = (Object.keys(this.csvRecords[0]));
            this.data = Object.values(this.csvRecords[0]);
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
    //console.log(files)
  }

  dataSource = this.csvRecords;

}

