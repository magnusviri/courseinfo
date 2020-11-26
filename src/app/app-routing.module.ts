import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseDetailComponent } from './course-detail/course-detail.component';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { BackendResolverService } from './datastore-resolver.service';

const routes: Routes = [
  { path:  'course/:courseId', component: CourseDetailComponent, resolve: { items: BackendResolverService } },
  { path: '**',   redirectTo: '/', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
