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



    getSnps() {
        let url = environment.annotationApi + '/region/?chrom=chr1&start=100000&end=200000&header_id=1%2022%203%204';

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
