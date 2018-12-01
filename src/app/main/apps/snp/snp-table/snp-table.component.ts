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
      { prop: "#chr" },
      { prop: "pos" },
      { prop: "ref" },
      { prop: "alt" },
      { prop: "ANNOVAR_refseq_Effect" },
      { prop: "ANNOVAR_refseq_Transcript_ID" },
      { prop: "ANNOVAR_refseq_Gene_ID" },
      { prop: "ANNOVAR_refseq_Closest_gene(intergenic_only)" },
      { prop: "ANNOVAR_refseq_HGVSc" },
      { prop: "ANNOVAR_refseq_HGVSp" },
      { prop: "ANNOVAR_refseq_Exon_Rank" },
      { prop: "ANNOVAR_refseq_summary" },
      { prop: "ANNOVAR_ucsc_Effect" },
      { prop: "ANNOVAR_ucsc_Transcript_ID" },
      { prop: "ANNOVAR_ucsc_Gene_ID" },
      { prop: "ANNOVAR_ucsc_Closest_gene(intergenic_only)" },
      { prop: "ANNOVAR_ucsc_HGVSc" },
      { prop: "ANNOVAR_ucsc_HGVSp" },
      { prop: "ANNOVAR_ucsc_Exon_Rank" },
      { prop: "ANNOVAR_ucsc_summary" },
      { prop: "COSMIC_ID" },
      { prop: "COSMIC_CNT" },
      { prop: "1000Gp3_AC" },
      { prop: "1000Gp3_AF" },
      { prop: "1000Gp3_AFR_AC" },
      { prop: "1000Gp3_AFR_AF" },
      { prop: "1000Gp3_EUR_AC" },
      { prop: "1000Gp3_EUR_AF" },
      { prop: "1000Gp3_AMR_AC" },
      { prop: "1000Gp3_AMR_AF" },
      { prop: "1000Gp3_EAS_AC" },
      { prop: "1000Gp3_EAS_AF" },
      { prop: "1000Gp3_SAS_AC" },
      { prop: "1000Gp3_SAS_AF" },
      { prop: "FANTOM5_enhancer_permissive" },
      { prop: "FANTOM5_enhancer_robust" },
      { prop: "FANTOM5_enhancer_target" },
      { prop: "FANTOM5_enhancer_expressed_tissue_cell" },
      { prop: "FANTOM5_enhancer_differentially_expressed_tissue_cell" },
      { prop: "FANTOM5_CAGE_peak_permissive" },
      { prop: "FANTOM5_CAGE_peak_robust" },
      { prop: "Uniprot_acc" },
      { prop: "Uniprot_id" },
      { prop: "Uniprot_aapos" }
    ]

    this.snpService.onSnpsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        // this.columns = data.columns;
        this.genes = data.rows;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
