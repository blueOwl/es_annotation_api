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
        let url = environment.annotationApi + '/region';///?chrom=chr1&start=100000&end=200000&header_id=1%2022%203%204';

        // let data = {limit: "2"};
        //this.httpClient.get<any>(apiUrl, {params: data});

        this.httpClient.get(url, { params: query })
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
