import { Component, Inject, OnInit, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../survey-monkey-calls/survey-monkey-calls.component';

@Component({
  selector: 'app-survey-selector',
  templateUrl: './survey-selector.component.html',
  styleUrls: ['./survey-selector.component.css']
})
export class SurveySelectorComponent{

  public idarray = [];

  constructor(
    public dialogRef: MatDialogRef<SurveySelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData[],
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }



}