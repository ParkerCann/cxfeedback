import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, timer } from "rxjs";



@Component({
  selector: 'app-current-date-time',
  templateUrl: './current-date-time.component.html',
  styleUrls: ['./current-date-time.component.css']
})
export class CurrentDateTimeComponent implements OnInit {

  time = new Date();
  rxTime = new Date();
  intervalId;
  subscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
