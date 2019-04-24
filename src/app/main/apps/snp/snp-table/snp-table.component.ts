import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';

import { SnpService } from './../services/snp.service'
import { Page } from '../models/page';
import { Gene } from '../models/gene';
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

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _httpClient: HttpClient,
    public noctuaMenuService: NoctuaMenuService,
    private snpService: SnpService
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
        if (snp.headers) {
          this.snp = snp;
          this.page.pageNumber = this.snp.page_info.page_num - 1;
          this.page.totalElements = this.snp.page_info.total_page
          this.columns = snp.headers.map(header => ({ prop: header }));
          this.genes = _.map(snp.data, (srcRow) => {
            return srcRow.reduce((destRow, item, i) => {
              destRow[snp.headers[i]] = item
              return destRow
            }, {});
          });

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
      });
  }

  setPage(pageInfo) {
    this.snpService.getSnpPage(this.snp.page_id, pageInfo.offset)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
