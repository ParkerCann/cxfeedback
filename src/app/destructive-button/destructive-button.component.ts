import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-destructive-button',
  templateUrl: './destructive-button.component.html',
  styleUrls: ['./destructive-button.component.css']
})
export class DestructiveButtonComponent implements OnInit {

  @Input() buttontext;
  
  constructor() { }

  ngOnInit(): void {
  }

}
