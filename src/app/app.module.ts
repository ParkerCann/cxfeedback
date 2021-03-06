import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserSettingsFormComponent } from './user-settings-form/user-settings-form.component';
import { SuccessButtonComponent } from './success-button/success-button.component';
import { RegularSecondaryBtnComponent } from './regular-secondary-btn/regular-secondary-btn.component';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { DestructiveButtonComponent } from './destructive-button/destructive-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DurationPickerModule } from 'ngx-duration-picker';
import { AddDataComponent } from './user-settings-form/add-data/add-data.component';
import { SharedService } from './shared.service';
import { AnswerFormComponent } from './answer-form/answer-form.component';
import { NameInputComponent } from './name-input/name-input.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CurrentDateTimeComponent } from './current-date-time/current-date-time.component';
import {MatIconModule} from '@angular/material/icon';
import { ResponseInputComponent } from './answer-form/response-input/response-input.component';
import {MatStepperModule} from '@angular/material/stepper';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';
import { ImportPageComponent } from './import-page/import-page.component';
import {NgxCsvParserModule } from 'ngx-csv-parser';
import { SurveyMonkeyCallsComponent } from './survey-monkey-calls/survey-monkey-calls.component'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { SurveySelectorComponent } from './survey-selector/survey-selector.component';

//import {enableProdMode} from '@angular/core';
//enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    UserSettingsFormComponent,
    SuccessButtonComponent,
    RegularSecondaryBtnComponent,
    PrimaryButtonComponent,
    DatePickerComponent,
    AddDataComponent,
    AnswerFormComponent,
    NameInputComponent,
    CurrentDateTimeComponent,
    ResponseInputComponent,
    FeedbackListComponent,
    DestructiveButtonComponent,
    ImportPageComponent,
    SurveyMonkeyCallsComponent,
    SurveySelectorComponent
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    OverlayModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    DurationPickerModule,
    ScrollingModule,
    MatIconModule,
    MatStepperModule,
    MatTooltipModule,
    MatTableModule,
    NgxCsvParserModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatRadioModule
    ],
  providers: [SharedService, 
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}