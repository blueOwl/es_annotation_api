import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NoctuaDirectivesModule } from './directives/directives';
import { NoctuaPipesModule } from './pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxDatatableModule,
        NoctuaDirectivesModule,
        NoctuaPipesModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxDatatableModule,
        NoctuaDirectivesModule,
        NoctuaPipesModule
    ]
})

export class NoctuaSharedModule { }
