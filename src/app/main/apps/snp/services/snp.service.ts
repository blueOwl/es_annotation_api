import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import 'rxjs/add/operator/map';

@Injectable({
    providedIn: 'root',
})
export class SnpService {
    onSnpsChanged: BehaviorSubject<any>;

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
        }, rsID : {
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

        this.inputTypes.selected = this.inputTypes.options[0]
    }

    selectInputType(inputType) {
        this.inputTypes.selected = inputType;
    }

    getSnps(query) {
        if (this.inputTypes.selected == this.inputType.chromosome) {
            let url = environment.annotationApi + '/region/HRC';
        } else if (this.inputTypes.selected == this.inputType.geneProduct) {
            let url = environment.annotationApi + '/gene/HRC';
            query['gene'] = query.geneProduct;
        } else if (this.inputTypes.selected == this.inputType.rsID) {
            let url = environment.annotationApi + '/rs/' + query.rsID;
            query = {};
        }
        this.httpClient.get(url, { params: query })
            .subscribe((response) => {
                this.onSnpsChanged.next(response);
            });
    }

    getSnpPage(id, pageNumber) {
        let url = `${environment.annotationApi}/gotopage/${id}/${pageNumber}`;
        this.httpClient.get(url)
            .subscribe((response) => {
                this.onSnpsChanged.next(response);
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
