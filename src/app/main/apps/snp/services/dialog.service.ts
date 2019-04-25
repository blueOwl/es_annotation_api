import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';


import 'rxjs/add/operator/map';
import { DownloadReadyComponent } from '../snp-table/download-ready/download-ready.component';


@Injectable({
    providedIn: 'root',
})
export class SnpDialogService {

    dialogRef: any;

    constructor(private httpClient: HttpClient,
        private snackBar: MatSnackBar,
        private _matDialog: MatDialog) {
    }

    openMessageToast(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000,
            verticalPosition: 'top'
        });
    }

    openDownloadToast(data) {
        this.snackBar.openFromComponent(DownloadReadyComponent, {
            data: data,
            duration: 100000,
        });
    }

}
