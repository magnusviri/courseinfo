import { Component, OnInit } from '@angular/core';
import { TruncatePipe } from '../truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BackendService } from '../backend/backend.service';

@Component({
  selector: 'app-geneds',
  template: `
<mat-selection-list dense #geneds [(ngModel)]="selectedOptions" (ngModelChange)="onNgModelChange($event)">
  <mat-list-option *ngFor="let gened of backend.geneds" [value]="gened.name">
  <span *ngIf="gened.name.length > 20; then thenBlock else elseBlock"></span>
  <ng-template #thenBlock>
    <span matTooltip="{{gened.name}}" matTooltipPosition="after">
      {{gened.name | truncate : 20}}
    </span>
  </ng-template>
  <ng-template #elseBlock><span>{{gened.name}}</span></ng-template>
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
export class GenedsComponent implements OnInit {
  public selectedOptions: string[] = [ ];
  constructor(public backend: BackendService) {}
  ngOnInit(): void {
  }
  onNgModelChange(event){
    console.log('on ng model change', event);
  }
}
