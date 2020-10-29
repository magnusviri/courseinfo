import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// import { CommonModule } from '@angular/common';  

import { AppRoutingModule } from './app-routing.module';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { TableViewComponent } from './table-view/table-view.component';
import { CoursesComponent } from './courses/courses.component';
import { GenedsComponent } from './geneds/geneds.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { MaterialModule } from './material/material.module';
import { SemestersComponent } from './semesters/semesters.component';
import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
import { TruncatePipe } from './truncate.pipe';
import { DetailComponent } from './detail/detail.component';
import { CellRouterLinkComponent } from './cell-router-link/cell-router-link.component';
// import { SelectAllCheckboxComponent } from './select-all-checkbox/select-all-checkbox.component';

@NgModule({
  declarations: [
    AppComponent,
    TableViewComponent,
    CoursesComponent,
    GenedsComponent,
    InstructorsComponent,
    SemestersComponent,
    TemplateRendererComponent,
    TruncatePipe,
    DetailComponent,
    CellRouterLinkComponent,
    // SelectAllCheckboxComponent,
  ],
  imports: [
    AgGridModule.withComponents([
      TemplateRendererComponent,
      CellRouterLinkComponent
    ]),
    BrowserModule,
    // CommonModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    
    AppRoutingModule,
    MaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
