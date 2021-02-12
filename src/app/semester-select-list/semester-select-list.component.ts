import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-semester-select-list',
  templateUrl: './semester-select-list.component.html',
  styleUrls: ['./semester-select-list.component.scss']
})
export class SemesterSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public datastoreFilter = 'semester_filter';
  public datastoreSelectList = 'semester_select_list';
  public quickFilterName = 'semesterQuickFilter';
  public selectionChange = 'semcode';
  private field = this.selectionChange;
  private headerName = 'Semester';
  public columnState = {
    colId: this.field,
    sort: 'desc',
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
        getQuickFilterText: function(params) {
          return params.data.year+' '+params.data.season;
        },
        valueFormatter: function(params) {
          var value = `${params.data.year} ${params.data.season}`;
          return value;
        },
        // cellRenderer: function(params) {
        //   var value = `${params.data.year} ${params.data.season}`;
        //   var catalog_link = `https://student.apps.utah.edu/uofu/stu/ClassSchedules/main/${params.value}/class_list.html?subject=BIOL"`;
        //   value += ` <a href="${catalog_link}" target="_blank" rel="noopener"><img width="10" src="assets/external-link.svg"></a>`;
        //   return value;
        // }
      },
    ];
  }
  ngOnInit(): void {
  }
}
