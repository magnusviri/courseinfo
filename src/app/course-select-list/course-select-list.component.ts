import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-course-select-list',
  templateUrl: './course-select-list.component.html',
  styleUrls: ['./course-select-list.component.scss']
})
export class CourseSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public quickFilterName = 'courseQuickFilter';
  public datastoreSelectList = 'course_select_list';
  public datastoreFilter = 'course_filter';
  public columnState = {
    colId: 'nam',
    sort: 'asc',
  };
  public someName = 'nam';

  constructor(datastore: DatastoreService, cookieService: CookieService) {
    super(datastore, cookieService);
    this.columnDefs = [
      {
        field: 'nam',
        headerName: 'Course Name',
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        tooltipField: 'nam',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
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
