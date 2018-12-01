import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PantherSharedModule } from '@panther/shared.module';
import { SnpTableComponent } from './snp/snp-table/snp-table.component';
import { AnnotationTreeComponent } from './annotation/annotation-tree/annotation-tree.component';
import { AnnotationComponent } from './annotation/annotation.component';

const routes = [];

@NgModule({
  declarations: [
    SnpTableComponent,
    AnnotationComponent,
    AnnotationTreeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    PantherSharedModule,
  ],
  exports: [
    SnpTableComponent,
    AnnotationComponent,
    AnnotationTreeComponent
  ],
  providers: [
  ]

})

export class AppsModule {
}
