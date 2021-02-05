import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-semester-select-list',
  templateUrl: './semester-select-list.component.html',
  styleUrls: ['./semester-select-list.component.scss']
})
export class SemesterSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public quickFilterName = 'semesterQuickFilter';
  public datastoreSelectList = 'semester_select_list';
  public datastoreFilter = 'semester_filter';
  public columnState = {
    colId: 'semcode',
    sort: 'desc',
  };
  public someName = 'semcode';

  constructor(datastore: DatastoreService, cookieService: CookieService) {
    super(datastore, cookieService);
    this.columnDefs = [
      {
        field: 'semcode',
        headerName: 'Semester',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        checkboxSelection: true,
        getQuickFilterText: function(params) {
          return params.data.year+' '+params.data.season;
        },
        // cellRenderer: function(params) {
        //   var value = `${params.data.year} ${params.data.season}`;
        //   var catalog_link = `https://student.apps.utah.edu/uofu/stu/ClassSchedules/main/${params.value}/class_list.html?subject=BIOL"`;
        //   value += ` <a href="${catalog_link}" target="_blank" rel="noopener"><img width="10" src="assets/external-link.svg"></a>`;
        //   return value;
        // }
        valueFormatter: function(params) {
          var value = `${params.data.year} ${params.data.season}`;
          return value;
        },

      },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
    this.postSort = function (rowNodes) {
      function move(toIndex, fromIndex) {
        rowNodes.splice(toIndex, 0, rowNodes.splice(fromIndex, 1)[0]);
      }
      var nextInsertPos = 0;
      for (var i = 0; i < rowNodes.length; i++) {
        if (rowNodes[i].data.active) {
          move(nextInsertPos, i);
          nextInsertPos++;
        }
      }
    };
  }

  ngOnInit(): void {
  }

}
