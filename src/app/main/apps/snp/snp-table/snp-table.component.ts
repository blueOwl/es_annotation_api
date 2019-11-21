import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';

import { SnpService } from './../services/snp.service'
import { Page } from '../models/page';
import { Gene } from '../models/gene';
import { SnpDialogService } from '../services/dialog.service';
import { MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

import 'rxjs/add/observable/of';
@Component({
  selector: 'ann-snp-table',
  templateUrl: './snp-table.component.html',
  styleUrls: ['./snp-table.component.scss']
})
export class SnpTableComponent implements OnInit {
  page = new Page();
  gene;
  genes: any[] = [];
  columns: any[] = [];
  snp: any;

  loadingIndicator: boolean;
  reorderable: boolean;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  }

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  displayedColumns = [];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _httpClient: HttpClient,
    private snpDialogService: SnpDialogService,
    public noctuaMenuService: NoctuaMenuService,
    public snpService: SnpService
  ) {
    this.loadingIndicator = false;
    this.reorderable = true;

    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {

    const self = this;

    this.columns = [];
    this.page.pageNumber = 0;
    this.page.size = 50;

    this.snpService.onSnpsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(snp => {
        this.setSnpPage(snp);
      });

    this.snpService.onSnpsDownloadReady
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res && res.url) {
          this.snpDialogService.openDownloadToast(res)
        }
      });
  }

  setSnpPage(snp) {
    if (snp.headers) {
      this.snp = snp;
      // this.snpService.downloadId = this.snp.page_id ? this.snp.page_id : null;
      //  this.page.pageNumber = this.snp.page_info.page_num - 1;
      // this.page.totalElements = this.snp.page_info.total_page
      this.columns = snp.headers.map((header) => (
        {
          columnDef: header,
          cell: (element: any) => `${element[header]}`
        }));

      this.displayedColumns = this.columns.map(c => c.columnDef);

      this.genes = snp.data
      /*    this.genes = _.map(snp.data, (srcRow) => {
           return srcRow.reduce((destRow, item, i) => {
             destRow[snp.headers[i]] = item
             return destRow
           }, {});
         }); */

      if (snp.gene_info) {
        this.gene = new Gene()
        this.gene.uniprotId = snp.gene_info.uniprot_id;
        this.gene.contig = snp.gene_info.contig;
        this.gene.start = snp.gene_info.start;
        this.gene.end = snp.gene_info.end;
      } else {
        this.gene = null
      }
    }
  }



  setPage($event) {
    if (this.snp && this.snp.page_id) {
      this.snpService.getSnpPage(this.snp.page_id, $event.pageIndex + 1)
    }
  }

  selectSnp(row) {
    this.snpService.onSnpChanged.next(row);

    this.noctuaMenuService.openRightDrawer();

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  download() {
    this.snpService.downloadSnp();
  }

}

