import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-instructor-select-list',
  templateUrl: './instructor-select-list.component.html',
  styleUrls: ['./instructor-select-list.component.scss']
})
export class InstructorSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public datastoreFilter = 'instructor_filter';
  public datastoreSelectList = 'instructor_select_list';
  public quickFilterName = 'instructorQuickFilter';
  public selectionChange = 'unid';
  private field = 'name';
  private headerName = 'Instructor';
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
        // cellRenderer: function(params) {
        //   var value = params.value;
        //   var link = `http://faculty.utah.edu/${params.data.unid}/teaching/index.hml/"`;
        //   value += ` <a href="${link}" target="_blank" rel="noopener"><img width="10" src="assets/external-link.svg"></a>`;
        //   return value;
        // }
      },
  //     { field: 'unid', sortable: true },
  //     { field: 'courses', sortable: true },
  //     { field: 'id' },
    ];
  }
  ngOnInit(): void {
  }
}
