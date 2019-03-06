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
    constructor(private httpClient: HttpClient) {
        this.onSnpsChanged = new BehaviorSubject([]);
    }


    getSnps(query) {
        let url = environment.annotationApi + '/region/HRC';
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
