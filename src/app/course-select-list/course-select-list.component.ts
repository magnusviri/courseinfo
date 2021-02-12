import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-course-select-list',
  templateUrl: './course-select-list.component.html',
  styleUrls: ['./course-select-list.component.scss']
})
export class CourseSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public datastoreFilter = 'course_filter';
  public datastoreSelectList = 'course_select_list';
  public quickFilterName = 'courseQuickFilter';
  public selectionChange = 'nam';
  private field = this.selectionChange;
  private headerName = 'Course Name';
  public columnState = {
    colId: this.field,
    sort: 'asc',
  };
  constructor(datastore: DatastoreService) {
    super(datastore);
    this.columnDefs = [
      {
        checkboxSelection: true,
        field: this.field,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerName: this.headerName,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        tooltipField: this.field,
      },
    ];
  }
  ngOnInit(): void {
  }
}
