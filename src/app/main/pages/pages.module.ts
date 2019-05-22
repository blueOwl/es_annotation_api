import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { AppsModule } from './../apps/apps.module';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const routes = [{
  path: '', component: HomeComponent
}, {
  path: 'about', component: AboutComponent
}];

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    NoctuaSharedModule,
    AppsModule
  ],
  providers: [
  ]
})

export class PagesModule {
}
