import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { SnpTableComponent } from './snp/snp-table/snp-table.component';
import { AnnotationTreeComponent } from './annotation/annotation-tree/annotation-tree.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { DownloadReadyComponent } from './snp/snp-table/download-ready/download-ready.component';

const routes = [];

@NgModule({
  declarations: [
    SnpTableComponent,
    AnnotationComponent,
    AnnotationTreeComponent,
    DownloadReadyComponent
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
  entryComponents: [
    DownloadReadyComponent
  ],
  providers: [
  ]

})

export class AppsModule {
}
