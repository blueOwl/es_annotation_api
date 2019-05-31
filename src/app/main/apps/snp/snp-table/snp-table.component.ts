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



  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns2 = [
    { columnDef: 'position', header: 'No.', cell: (element: any) => `${element.position}` },
    { columnDef: 'name', header: 'Name', cell: (element: any) => `${element.name}` },
    { columnDef: 'weight', header: 'Weight', cell: (element: any) => `${element.weight}` },
    { columnDef: 'symbol', header: 'Symbol', cell: (element: any) => `${element.symbol}` },
  ];
  displayedColumns = [];
  //displayedColumns = this.columns2.map(c => c.columnDef);
  dataSource = ELEMENT_DATA

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
        this.foo2(snp);
      });

    this.snpService.onSnpsDownloadReady
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res && res.url) {
          this.snpDialogService.openDownloadToast(res)
        }
      });
  }

  foo2(snp) {
    if (snp.headers) {
      this.snp = snp;
      this.snpService.downloadId = this.snp.page_id ? this.snp.page_id : null;
      this.page.pageNumber = this.snp.page_info.page_num - 1;
      this.page.totalElements = this.snp.page_info.total_page
      this.columns = snp.headers.map((header) => (
        {
          columnDef: header,
          cell: (element: any) => `${element[header]}`
        }));

      console.log(this.columns)
      this.displayedColumns = this.columns.map(c => c.columnDef);
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
  }

  foo(snp) {
    if (snp.headers) {
      this.snp = snp;
      this.snpService.downloadId = this.snp.page_id ? this.snp.page_id : null;
      this.page.pageNumber = this.snp.page_info.page_num - 1;
      this.page.totalElements = this.snp.page_info.total_page
      this.columns = snp.headers.map(header => ({ prop: header }));

      console.log(this.columns)
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
  }

  setPage(pageInfo) {
    if (this.snp && this.snp.page_id) {
      this.snpService.getSnpPage(this.snp.page_id, pageInfo.offset)
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  download() {
    this.snpService.downloadSnp();
  }

}



const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];


export class ExampleDataSource extends DataSource<any> {

  connect(): Observable<Element[]> {
    return Observable.of(ELEMENT_DATA);
  }

  disconnect() { }
}