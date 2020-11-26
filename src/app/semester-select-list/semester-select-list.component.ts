import { Component, OnInit } from '@angular/core';
import { BackendService } from '../datastore.service';
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
  selector: 'app-semester-select-list',
  templateUrl: './semester-select-list.component.html',
  styleUrls: ['./semester-select-list.component.scss']
})
export class SemesterSelectListComponent implements OnInit {
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
