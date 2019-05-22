import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SnpService {
    onSnpsChanged: BehaviorSubject<any>;
    onSnpsDownloadReady: BehaviorSubject<any>;
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

        this.inputTypes.selected = this.inputTypes.options[0]
    }

    selectInputType(inputType) {
        this.inputTypes.selected = inputType;
    }

    getSnps(query) {
        let url = environment.annotationApi

        switch (this.inputTypes.selected) {

            case this.inputType.chromosome:
                url += '/region/HRC';
                break;
            case this.inputType.geneProduct:
                url += '/gene/HRC';
                query['gene'] = query.geneProduct;

                //remove this part fake data
                //url = 'api/gene-snp-result'
                //this.httpClient.get(url).pipe(
                //    tap(res => {
                //        console.log(res)
                //    })
                //)
                //    .subscribe((response) => {
                //        this.onSnpsChanged.next(response);
                //    });
                //return;
                //fakse
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

                        //{"url":"/download/tmp/dd58a3a9-e81c-4dbb-a4ac-ee52656aa9fb"}

                    })
                )
                    .subscribe((response) => {
                        //this.snpDialogService.openMessageToast(environment.annotationApi + response['url'], 'OK');
                        this.onSnpsDownloadReady.next(response);
                    });
                ;
                return;
        }

        if (url) {
            this.httpClient.get(url, { params: query }).pipe(
                tap(res => {
                    console.log(res)
                })
            )
                .subscribe((response) => {
                    this.onSnpsChanged.next(response);
                });
        }
    }

    getSnpPage(id, pageNumber) {
        let url = `${environment.annotationApi}/gotopage/${id}/${pageNumber}`;
        this.httpClient.get(url)
            .subscribe((response) => {
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
