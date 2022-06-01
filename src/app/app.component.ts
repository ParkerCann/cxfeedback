import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { SurveyMonkeyCallsComponent } from './survey-monkey-calls/survey-monkey-calls.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Feedback Form';
  constructor(public dialog: MatDialog) {}

  @ViewChild(SurveyMonkeyCallsComponent) child;
  
  openDialog() {
    
    const dialogRef = this.dialog.open(SurveyMonkeyCallsComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  dataLayerPush_pageName(val:any){
    window.dataLayer.push({
      'event': 'virtualPageView',
      'pageName': val
    })
  }
}
