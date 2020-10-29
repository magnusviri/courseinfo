import { Component, OnInit } from '@angular/core';
import { TruncatePipe } from '../truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BackendService } from '../backend/backend.service';

@Component({
  selector: 'app-instructors',
  template: `
<mat-selection-list dense #instructors [(ngModel)]="selectedOptions" (ngModelChange)="onNgModelChange($event)">
  <mat-list-option *ngFor="let instructor of backend.instructors" [value]="instructor.name">
  <span *ngIf="instructor.name.length > 22; then thenBlock else elseBlock"></span>
  <ng-template #thenBlock>
    <span matTooltip="{{instructor.name}}" matTooltipPosition="after">
      {{instructor.name | truncate : 22}}
    </span>
  </ng-template>
  <ng-template #elseBlock><span>{{instructor.name}}</span></ng-template>
  </mat-list-option>
</mat-selection-list>
  `,
  styles: [`
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
export class InstructorsComponent implements OnInit {
  public selectedOptions: string[] = [];
  constructor(public backend: BackendService) {}
  ngOnInit(): void {
    console.log("ngOnInit");
  }
  onNgModelChange(event){
    console.log('on ng model change', event);
  }
}
