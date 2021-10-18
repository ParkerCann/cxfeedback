import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-regular-secondary-btn',
  templateUrl: './regular-secondary-btn.component.html',
  styleUrls: ['./regular-secondary-btn.component.css']
})
export class RegularSecondaryBtnComponent implements OnInit {

  @Input() buttontext;

  constructor() { }

  ngOnInit(): void {
  }

}
