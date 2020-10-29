import { Component, OnInit } from '@angular/core';
import { TruncatePipe } from '../truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BackendService } from '../backend/backend.service';

@Component({
  selector: 'app-courses',
  template: `
<mat-selection-list dense #courseList [(ngModel)]="selectedOptions" (ngModelChange)="onNgModelChange($event)">
  <mat-list-option *ngFor="let course of backend.courseList" [value]="course.id">
  <span *ngIf="course.name.length + 5 > 19; then thenBlock else elseBlock"></span>
  <ng-template #thenBlock>
    <span matTooltip="{{course.catalog}} {{course.name}}" matTooltipPosition="after">
      {{course.catalog}} {{course.name | truncate : 14}}
    </span>
  </ng-template>
  <ng-template #elseBlock><span>{{course.catalog}} {{course.name}}</span></ng-template>
  </mat-list-option>
</mat-selection-list>
  `,
  styles: [`
//  can't get this to work
// form .mat-list-base .mat-list-item .mat-list-item-content,
// form .mat-list-base .mat-list-option .mat-list-item-content
// {
// 	padding: 0;
// 	background-color: red !important;
// }
// form .mat-list-base .mat-list-item .mat-list-item-content-reverse,
// form .mat-list-base .mat-list-option .mat-list-item-content-reverse
// {
// 	padding: 0;
// 	background-color: red !important;
// }
.mat-list-base .mat-list-item, .mat-list-base .mat-list-option {
  height: 20px;
}
mat-selection-list {
	height: 200px;
	overflow: scroll;
	width: 200px;
	overflow: scroll;
	border: 1px solid;
	border-color:#000;
	background: #fff;
	padding: 0;
}
  `]
})
export class CoursesComponent implements OnInit {
  public selectedOptions: string[] = [ ];
  constructor(public backend: BackendService) {}
  ngOnInit(): void {
  }
  onNgModelChange(event){
    console.log('on ng model change', event);
  }
}
