import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-instructor-select-list',
  templateUrl: './instructor-select-list.component.html',
  styleUrls: ['./instructor-select-list.component.scss']
})
export class InstructorSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public quickFilterName = 'instructorQuickFilter';
  public cookieFilterName = 'instructorFilter';
  public datastoreSelectList = 'instructor_select_list';
  public datastoreFilter = 'instructor_filter';
  public columnState = {
    colId: 'name',
    sort: 'asc',
  };
  public someName = 'unid';

  constructor(datastore: DatastoreService, cookieService: CookieService) {
    super(datastore, cookieService);
    this.columnDefs = [
      {
        field: 'name',
        headerName: "Instructor",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        checkboxSelection: true,
        tooltipField: 'name',
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
