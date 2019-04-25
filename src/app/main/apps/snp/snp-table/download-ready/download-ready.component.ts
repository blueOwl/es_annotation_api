import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { SnpService } from './../../services/snp.service'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-download-ready',
  templateUrl: './download-ready.component.html',
  styleUrls: ['./download-ready.component.scss']
})
export class DownloadReadyComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  downloadUrl: any;

  constructor(
    private snpService: SnpService,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    this.downloadUrl = environment.annotationApi + data.url
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {


  }

}
