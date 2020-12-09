import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { JsonApiModule } from 'angular2-jsonapi';
import { AgGridModule } from 'ag-grid-angular';

import { FormsModule } from '@angular/forms';
import { CellRouterLinkComponent } from './cell-router-link/cell-router-link.component';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { AdminComponent } from './admin/admin.component';
import { GridComponent } from './grid/grid.component';

import { AttrSelectListComponent } from './attr-select-list/attr-select-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseSelectListComponent } from './course-select-list/course-select-list.component';
import { InstructorSelectListComponent } from './instructor-select-list/instructor-select-list.component';
import { ResultsTableComponent } from './course-results/course-results.component';
import { SemesterSelectListComponent } from './semester-select-list/semester-select-list.component';

// import { TemplateRendererComponent } from './template-renderer/template-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,

    CellRouterLinkComponent,

    FooterComponent,
    HeaderComponent,

    AdminComponent,
    GridComponent,

    AttrSelectListComponent,
    CourseDetailComponent,
    CourseSelectListComponent,
    InstructorSelectListComponent,
    ResultsTableComponent,
    SemesterSelectListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JsonApiModule,
    AgGridModule.withComponents([
//       TemplateRendererComponent,
      // CellRouterLinkComponent
    ]),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
