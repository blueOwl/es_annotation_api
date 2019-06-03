
import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-annotation-detail',
  templateUrl: './annotation-detail.component.html',
  styleUrls: ['./annotation-detail.component.scss']
})
export class AnnotationDetailDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  annotationDetail

  constructor(
    private _matDialogRef: MatDialogRef<AnnotationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this._unsubscribeAll = new Subject();

    this.annotationDetail = this._data.annotation
    console.log(this.annotationDetail)
  }

  ngOnInit() {
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
