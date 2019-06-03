import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';


import 'rxjs/add/operator/map';
import { AnnotationDetailDialogComponent } from '../dialogs/annotation-detail/annotation-detail.component';


@Injectable({
    providedIn: 'root',
})
export class AnnotationDialogService {

    dialogRef: any;

    constructor(private httpClient: HttpClient,
        private snackBar: MatSnackBar,
        private _matDialog: MatDialog) {
    }

    openAnnotationDetailDialog(annotation: any[]): void {
        this.dialogRef = this._matDialog.open(AnnotationDetailDialogComponent, {
            panelClass: 'annoton-errors-dialog',
            data: {
                annotation: annotation
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

}
