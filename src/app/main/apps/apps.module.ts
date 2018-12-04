import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
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
    NoctuaSharedModule,
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
