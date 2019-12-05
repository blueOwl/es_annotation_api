import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import { tap, finalize } from 'rxjs/operators';
import { Client } from 'elasticsearch-browser';

@Injectable({
    providedIn: 'root',
})
export class SnpService {
    onSnpsChanged: BehaviorSubject<any>;
    onSnpChanged: BehaviorSubject<any>;
    onSnpsDownloadReady: BehaviorSubject<any>;
    perPage = environment.esResultSize;
    loading = false;
    downloadId;

    private client: Client;
    inputType: any = {
        chromosome: {
            id: 1,
            label: 'Chromosome'
        }, chromosomeList: {
            id: 2,
            label: 'Variants List'
        }, geneProduct: {
            id: 3,
            label: 'Gene Product'
        }, rsID: {
            id: 4,
            label: 'rsID or variant id'
        }
    };

    inputTypes: any = {
        options: [
            this.inputType.chromosome,
            this.inputType.chromosomeList,
            this.inputType.geneProduct,
            this.inputType.rsID
        ]
    };

    constructor(private httpClient: HttpClient) {
        this.onSnpsChanged = new BehaviorSubject([]);
        this.onSnpsDownloadReady = new BehaviorSubject(null);
        this.onSnpChanged = new BehaviorSubject(null);
        this.inputTypes.selected = this.inputTypes.options[0];

        if (!this.client) {
            this._connect();
        }
    }

    selectInputType(inputType) {
        this.inputTypes.selected = inputType;
    }

    getSnps(annotationQuery: any, page: number): any {

        const query = {
            // q: 'The',
            '_source': annotationQuery.sources,
            'query': {
                'bool': {
                    'filter': [
                        { 'term': { 'chr': annotationQuery.chrom } },
                        { 'range': { 'pos': { 'gte': annotationQuery.start, 'lte': annotationQuery.end } } }]
                }
            },
        };

        switch (this.inputTypes.selected) {
            case this.inputType.chromosome:
                break;
            case this.inputType.geneProduct:
                break;
            case this.inputType.rsID:
                break;
            case this.inputType.chromosomeList:
                break;
        }

        return this.client.search({
            from: (page - 1) * this.perPage,
            size: this.perPage,
            body: query
        }).then((body) => {
            if (body.hits.total.value > 0) {
                const esData = body.hits.hits as [];
                //   this.totalHits = body.hits.total;
                //   this.searchTime = body.took;
                //  this.totalPages = Array(Math.ceil(body.hits.total / this.PER_PAGE)).fill(4);
                const snpData = esData.map((snp: any) => {
                    return snp._source;
                })
                const data = {
                    data: snpData,
                    headers: annotationQuery.sources
                };

                console.log(data)
                this.onSnpsChanged.next(data);
            } else {
                this.onSnpsChanged.next([]);
            }
        }, (err) => {

        });
    }



    getSnpPage(id, pageNumber) {
        const self = this;
        const url = `${environment.annotationApi}/gotopage/${id}/${pageNumber}`;

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
        if (!this.downloadId) { return; }

        const url = `${environment.annotationApi}/total_res/${this.downloadId}`;

        this.httpClient.get(url)
            .subscribe((response) => {
                this.onSnpsDownloadReady.next(response);
            });
    }

    isAvailable(): any {
        return this.client.ping({
            requestTimeout: Infinity,
            body: 'Hello JOAC Search!'
        });
    }

    private _connect() {
        this.client = new Client({ host: environment.annotationApi });
    }

}
