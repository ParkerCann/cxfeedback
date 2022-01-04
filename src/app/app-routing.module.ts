import { NgModule } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterModule, Routes } from '@angular/router';

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
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private router: Router){
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        //Trying to see if I can get the page to refresh after switching pages. Might just need to add the window reload to the navigation buttons.
        //console.log("router change");
        //window.location.reload();
      }
      // NavigationStart
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }
}
