import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import { tap, finalize } from 'rxjs/operators';
import { Client } from 'elasticsearch-browser';
import { SnpPage } from '../models/page';

@Injectable({
    providedIn: 'root',
})
export class SnpService {
    snpResultsSize = environment.snpResultsSize;
    onSnpsChanged: BehaviorSubject<SnpPage>;
    onSnpChanged: BehaviorSubject<any>;
    onSnpsDownloadReady: BehaviorSubject<any>;
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
        this.onSnpsChanged = new BehaviorSubject(null);
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
        const self = this;
        self.loading = true;

        const query: any = {
            '_source': [...['chr', 'pos', 'ref', 'alt', 'rs_dbSNP151'], ...annotationQuery.source],
        };

        switch (this.inputTypes.selected) {
            case this.inputType.chromosome:
                {
                    query.query = {
                        'bool': {
                            'filter': [
                                { 'term': { 'chr': annotationQuery.chrom } },
                                { 'range': { 'pos': { 'gte': annotationQuery.start, 'lte': annotationQuery.end } } }]
                        }
                    }
                    break;
                    }
            case this.inputType.geneProduct:
                {
                    this.httpClient.get(`${environment.annotationApi}/gene`, { params:{'gene':annotationQuery.geneProduct}})
                        .subscribe((response) => {
                            const res:any = response;
                            query.query = {
                                'bool': {
                                    'filter': [
                                        { 'term': { 'chr': res.gene_info.contig } },
                                        { 'range': { 'pos': { 'gte': res.gene_info.start, 'lte': res.gene_info.end } } }]
                                }
                            };
                            return self.getSnpsPage(query, page);
                        });
                    return;
                    }
            case this.inputType.rsID:
                {//    q = rs_dbSNP151:% 22rs555419020 % 22
                    query.query = {
                        'bool': {
                            'filter': [
                                { 'term': { 'rs_dbSNP151': annotationQuery.rsID } },
                                ]
                        }
                    }
                    break;
                }
            case this.inputType.chromosomeList:
                break;
        }
        //console.log(query);
        return self.getSnpsPage(query, page);
    }

    getSnpsPage(query: any, page: number): any {
        const self = this;
        self.loading = true;
        query.from = (page - 1) * this.snpResultsSize;
        query.size = this.snpResultsSize;
        console.log(query);
        return this.client.search({
            body: query
        }).then((body) => {
            if (body.hits.total.value > 0) {
                const snpPage = new SnpPage();
                const esData = body.hits.hits as [];
                const snpData = esData.map((snp: any) => {
                    return snp._source;
                });

                snpPage.query = query;
                snpPage.total = body.hits.total.value;
                snpPage.size = self.snpResultsSize;
                snpPage.snps = snpData;
                snpPage.source = query._source;

                this.onSnpsChanged.next(snpPage);
            } else {
                this.onSnpsChanged.next(null);
            }
            self.loading = false;
        }, (err) => {
            self.loading = false;
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
        this.client = new Client({ host: `${environment.annotationApi}/${environment.dataset}` });
    }

}
