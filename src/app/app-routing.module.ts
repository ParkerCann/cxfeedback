import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserSettingsFormComponent } from './user-settings-form/user-settings-form.component';
import { AnswerFormComponent } from './answer-form/answer-form.component';
import { FeedbackListComponent } from 'src/app/feedback-list/feedback-list.component';


const routes: Routes = [
  {path: '', redirectTo: 'feedback', pathMatch: 'full'},
{path:'feedback',component:UserSettingsFormComponent},
{path:'answer',component:AnswerFormComponent},
{path:'feedbacklist', component:FeedbackListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
