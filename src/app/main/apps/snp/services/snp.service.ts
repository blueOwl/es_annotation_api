import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SnpService {
    onSnpsChanged: BehaviorSubject<any>;
    onSnpChanged: BehaviorSubject<any>;
    onSnpsDownloadReady: BehaviorSubject<any>;
    loading: boolean = false;
    downloadId

    inputType: any = {
        chromosome: {
            id: 1,
            label: "Chromosome"
        }, chromosomeList: {
            id: 2,
            label: "Variants List"
        }, geneProduct: {
            id: 3,
            label: "Gene Product"
        }, rsID: {
            id: 4,
            label: "rsID or variant id"
        }
    }

    inputTypes: any = {
        options: [
            this.inputType.chromosome,
            this.inputType.chromosomeList,
            this.inputType.geneProduct,
            this.inputType.rsID
        ]
    }

    constructor(private httpClient: HttpClient) {
        this.onSnpsChanged = new BehaviorSubject([]);
        this.onSnpsDownloadReady = new BehaviorSubject(null);
        this.onSnpChanged = new BehaviorSubject(null);

        this.inputTypes.selected = this.inputTypes.options[0]
    }

    selectInputType(inputType) {
        this.inputTypes.selected = inputType;
    }

    getSnps(query) {
        const self = this;
        let url = environment.annotationApi;

        switch (this.inputTypes.selected) {
            case this.inputType.chromosome:
                url += '/region/HRC';
                break;
            case this.inputType.geneProduct:
                url += '/gene/HRC';
                query['gene'] = query.geneProduct;
                break;
            case this.inputType.rsID:
                url += '/rs/' + query.rsID;
                query = {};
                break;
            case this.inputType.chromosomeList:
                url += '/vcf'
                console.log('run');
                this.httpClient.post(url, { params: query }).pipe(
                    tap(res => {
                        console.log(res)
                    })
                ).subscribe((response) => {
                    this.onSnpsDownloadReady.next(response);
                });
                return;
        }

        if (url) {
            self.loading = true;
            this.httpClient.get(url, { params: query }).pipe(
                finalize(() => {
                    self.loading = false;
                })
            ).subscribe((response) => {
                this.onSnpsChanged.next(response);
            });
        }
    }

    getSnpPage(id, pageNumber) {
        const self = this;
        let url = `${environment.annotationApi}/gotopage/${id}/${pageNumber}`;

        self.loading = true;
        this.httpClient.get(url).pipe(
            finalize(() => {
                self.loading = false;
            })
        ).subscribe((response) => {
            this.onSnpsChanged.next(response);
        });
    }

    downloadSnp() {
        if (!this.downloadId) return;

        let url = `${environment.annotationApi}/total_res/${this.downloadId}`;

        this.httpClient.get(url)
            .subscribe((response) => {
                this.onSnpsDownloadReady.next(response);
            });
    }


    getFakeDbSnps() {
        this.httpClient.get('api/snp-result')
            .subscribe((response) => {
                console.log(response)
                this.onSnpsChanged.next(response);
            });
    }

}
