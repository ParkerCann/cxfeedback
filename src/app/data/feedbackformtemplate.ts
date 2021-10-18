import { Time } from "@angular/common";

export interface FeedbackInterface {
    username: number,
    respondeetype: number,
    respondeename: number,
    product: number,
    feedbacktype: number,
    date: Date,
    duration: Time,
    chkbox: boolean
} 