import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';




import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import { ComponentFactoryResolver } from '@angular/core/src/render3';


@Injectable({
    providedIn: 'root',
})
export class SnpService {
    onSnpsChanged: BehaviorSubject<any>;
    constructor(private httpClient: HttpClient) {
        this.onSnpsChanged = new BehaviorSubject([]);
    }



    /*
    getSnps() {
        let data = { "annotation_headers": ["1000Gp3_AC", "1000Gp3_AF", "1000Gp3_AFR_AC", "1000Gp3_AFR_AF", "1000Gp3_AMR_AC", "1000Gp3_AMR_AF", "1000Gp3_EAS_AC", "1000Gp3_EAS_AF", "1000Gp3_EUR_AC", "1000Gp3_EUR_AF", "1000Gp3_SAS_AC", "1000Gp3_SAS_AF", "ANNOVAR_refseq_Closest_gene(intergenic_only)", "ANNOVAR_refseq_Effect", "ANNOVAR_refseq_Exon_Rank", "ANNOVAR_refseq_Gene_ID", "ANNOVAR_refseq_HGVSc", "ANNOVAR_refseq_HGVSp", "ANNOVAR_refseq_Transcript_ID", "ANNOVAR_refseq_summary", "ANNOVAR_ucsc_Closest_gene(intergenic_only)", "ANNOVAR_ucsc_Effect", "ANNOVAR_ucsc_Exon_Rank", "ANNOVAR_ucsc_Gene_ID", "ANNOVAR_ucsc_HGVSc", "ANNOVAR_ucsc_HGVSp", "ANNOVAR_ucsc_Transcript_ID", "ANNOVAR_ucsc_summary", "COSMIC_CNT", "COSMIC_ID", "FANTOM5_CAGE_peak_permissive", "FANTOM5_CAGE_peak_robust", "FANTOM5_enhancer_differentially_expressed_tissue_cell", "FANTOM5_enhancer_expressed_tissue_cell", "FANTOM5_enhancer_permissive", "FANTOM5_enhancer_robust", "FANTOM5_enhancer_target", "Uniprot_aapos", "Uniprot_acc", "Uniprot_id"], "chrom": "chr2", "pos": 100008, "ref": "T", "alt": "A" }

        this.httpClient.post(environment.annotationApi + '/variant', data)
            .subscribe((response) => {
                console.log(response)
                this.onSnpsChanged.next(response);
            });
    }

  */
    getSnps() {
        this.httpClient.get('api/snp-result')
            .subscribe((response) => {
                console.log(response)
                this.onSnpsChanged.next(response);
            });
    }

}
