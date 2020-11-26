import { Component, ViewChild, TemplateRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
// import { GridOptions, Module, AllCommunityModules } from "@ag-grid-community/all-modules";

// import { TemplateRendererComponent } from '../template-renderer/template-renderer.component';
import { BackendService } from '../datastore.service';
import { CellRouterLinkComponent } from '../cell-router-link/cell-router-link.component';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
 
  private gridApi;
  private gridOptions;
  private gridColumnApi;
  public columnDefs;
  public paginationPageSize;
  public defaultColDef;
  public columnTypes;
  public rowData: any = [];

  constructor(private backend: BackendService) {
//     this.gridOptions = <GridOptions>{
// //       columnDefs: ResultsTableComponent.createColumnDefs(),
// //       defaultColDef: ResultsTableComponent.createDefaultColDef(),
//     };
  }

  onGridReady(params) {
    this.defaultColDef = {
      maxWidth: 100,
      sortable: true,
      // editable: true,
      resizable: true,
      floatingFilter: true,
      suppressMenu: true,
      filter: 'agTextColumnFilter',
    };
    this.columnDefs = ResultsTableComponent.createColumnDefs();

  //   gridOptions.onRowClicked = params => {
  //     console.log(params);
  //     if ( params.node && params.node.selected ) {
  //         var id = params.node.data.id; // or whatever the field is called
  //         link = `url/${id}`; // however you are doing navigation
  //     }
  //  }
    console.log(params);
    this.paginationPageSize = 3000;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.backend.data;
    this.backend.gridApi = params.api;
    // this.gridApi.setRowData(this.backend.data);

    //     // var newItems = [createNewRowData(), createNewRowData(), createNewRowData()];
    //     // var res = this.gridApi.applyTransaction({
    //     //   add: newItems,
    //     //   addIndex: addIndex,
    //     // });
    //     console.log(this);
    //     }
    //     this.gridApi.refreshClientSideRowModel(null)

    //     // params.api.paginationGoToPage(4);

    this.gridApi.sizeColumnsToFit();
    // this.gridOptions.suppressRowClickSelection = true;


      // set custom filter model
      // https://www.ag-grid.com/javascript-grid-filter-api/

    // var hardcodedFilter = {
    //   Component: {
    //     type: 'set',
    //     values: ['Labratory', 'Discussion'],
    //   },
    // };
    // this.gridApi.setFilterModel(hardcodedFilter);

    // var filterInstance = this.gridApi.getFilterInstance('Component');
    // console.log(filterInstance);
    // filterInstance.setModel({
    //   filterType: 'text',
    //   type: 'startsWith',
    //   filter: 'Lab'
    // });
    // console.log(filterInstance);
    // this.gridApi.onFilterChanged();

  }
  greet(row: any) {
    alert(`${ row["Description URL"] }`);
  }

  // getSelectedRows() {
  //   const selectedNodes = this.agGrid.api.getSelectedNodes();
  //   const selectedData = selectedNodes.map(node => node.data );
  //   const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
  //   alert(`Selected nodes: ${selectedDataStringPresentation}`);
  // }
  // onPageSizeChanged() {
  //   // var newPageSize = Number(document.getElementById('page-size').value);
  //   // this.gridApi.paginationSetPageSize(newPageSize);
  // }

  saveFilterModel() {
    // savedFilterModel = this.gridApi.getFilterModel();
  }
  restoreFilterModel() {
    // this.gridApi.setFilterModel(savedFilterModel);
  }
  onRowSelected(event) {
    window.alert(
      'row ' +
        event.node.data.athlete +
        ' selected = ' +
        event.node.isSelected()
    );
  }
  onSelectionChanged(event) {
    var rowCount = event.api.getSelectedNodes().length;
    window.alert('selection changed, ' + rowCount + ' rows selected');
  }

  private static createColumnDefs() {
    return [
      {
        field: 'sem',
        headerName: 'Semester',
        refData: {
          4: 'Spring',
          6: 'Summer',
          8: 'Fall',
        },
      },
      {
        field: 'yea',
        headerName: 'Year',
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'cat',
        headerName: 'Catalog',
        filter: 'agNumberColumnFilter',
        valueFormatter: function(params) {
          return 'BIOL '+params.value;
        },
      },
      {
        field: 'nam',
        headerName: 'Name',
        maxWidth: 300,
        cellRendererFramework: CellRouterLinkComponent,
        cellRendererParams: {
          inRouterLink: '/course',
          // id: id,
        },
      },
      {
        field: 'ins',
        maxWidth: 500,
        headerName: 'Instructor(s)',
        cellRenderer: function(params) {
          let text = "";
          if ( params.value ) {
            for (var instructorInfo of params.value ) {
              if ( instructorInfo[1] ) {
                text += `<a href="http://faculty.utah.edu/${instructorInfo[1]}/teaching/index.hml" target="_blank" rel="noopener">${instructorInfo[0]}</a> `;
              } else {
                text += instructorInfo[0];
              }
              // if ( instructorInfo[2] ) {
              //   text += ` (<a href="${instructorInfo[2]}" target="_blank" rel="noopener">Eval</a>) `;
              // }
            }
          }
          return text;
        },
      },
      {
        field: 'gen',
        headerName: 'Attributes',
      },
      {
        field: 'com',
        headerName: 'Component',
        maxWidth: 120,
      },
      {
        field: 'sec',
        headerName: 'Section',
      },
      {
        field: 'enr',
        headerName: 'Enrolled',
        filter: 'agNumberColumnFilter',
        comparator: function(valueA, valueB) {
          if (valueA === null && valueA === null) {
            return 0;
          }
          if (valueA === null) {
            return -1;
          }
          if (valueB === null) {
            return 1;
          }
          return valueA - valueB;
        },
      },
      {
        field: 'cap',
        headerName: 'Capacity',
        // filter: 'agNumberColumnFilter',
        comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
          return valueA - valueB;
        },
      },

      // router links
      //https://medium.com/ag-grid/enhance-your-angular-grid-reports-with-formatted-values-and-links-34fa57ca2952


      //  checkboxSelection: true
    ];
  }

}

function buildYearSemester(yearText:string,semesterText:string) {
  let year = (Number(yearText)-1900)*10;
  let semester = 0;
  switch(semesterText) {
    case "Spring": {
      semester = 4;
      break;
    }
    case "Summer": {
      semester = 6;
      break;
    }
    case "Fall": {
      semester = 8;
      break;
    }
 }
 return year+semester;
}
