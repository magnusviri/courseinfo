import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend/backend.service';
// import { SelectAllCheckboxComponent } from '../select-all-checkbox/select-all-checkbox.component';

// https://onthecode.co.uk/implement-select-all-option-mat-select-angular-material-reactive-forms/
// <form [formGroup]="form">
//     <mat-form-field class="full-width">
//         <mat-select placeholder="Projects" formControlName="project" multiple>
 
//             <app-select-all-checkbox [model]="form.get('project')" [values]="projects">
//             </app-select-all-checkbox>
 
//             <mat-option *ngFor="let project of projects" [value]="project">{{ project.name }}</mat-option>
//         </mat-select>
//     </mat-form-field>
// </form>

@Component({
  selector: 'app-semesters',
  template: `
<mat-selection-list dense #semesters [(ngModel)]="selectedOptions" (ngModelChange)="onNgModelChange($event)">
  <mat-list-option *ngFor="let semester of backend.semesters" [value]="semester.id">
    {{semester.year}} {{semester.season}}
  </mat-list-option>
</mat-selection-list>

  `,
// <div>
//   Selected: {{ selectedOptions | json }}
// </div>

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
export class SemestersComponent implements OnInit {
  public selectedOptions: number[] = [];
  constructor(public backend: BackendService) {}
 
  ngOnInit(): void {
    this.backend.buildSemesters();
    this.selectedOptions = [this.backend.semesters[0]['id'], this.backend.semesters[1]['id']];
    this.backend.loadSemesters([this.backend.semesters[1]['code'], this.backend.semesters[0]['code']]);


    
  }
  onNgModelChange(event){
    for (var id of event) {
      this.backend.loadSemesters([this.backend.semesters[id]['code']]);
    }
  }
}
