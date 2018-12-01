import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PantherMenuService } from '@panther.common/services/panther-menu.service';

import { SnpService } from './../services/snp.service'
@Component({
  selector: 'ann-snp-table',
  templateUrl: './snp-table.component.html',
  styleUrls: ['./snp-table.component.scss']
})
export class SnpTableComponent implements OnInit {

  genes: any[] = [];
  columns: any[] = [];

  loadingIndicator: boolean;
  reorderable: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _httpClient: HttpClient,
    public pantherMenuService: PantherMenuService,
    private snpService: SnpService
  ) {
    this.loadingIndicator = false;
    this.reorderable = true;

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.columns = [
      //   { prop: 'name' },
      { prop: "Gene ID" },
      { prop: "Mapped IDs" },
      { prop: "Gene Name" },
      { prop: "Gene Symbol" },
      { prop: "Ortholog" },
      { prop: "PANTHER Family" },
      { prop: "PANTHER Protein Class" },
      { prop: "Annotation" }
    ];

    this.snpService.onSnpsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(genes => {
        this.genes = genes;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
