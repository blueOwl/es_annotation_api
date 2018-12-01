import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

import { AnnotationTreeFakeDb } from './../data/annotation-tree';
import { SnpResultFakeDb } from './../data/snp-result'

@Injectable({
    providedIn: 'root'
})
export class FakeDbService implements InMemoryDbService {
    createDb(): any {
        return {
            'annotation-list': AnnotationTreeFakeDb.data,
            'snp-result0': SnpResultFakeDb.data
        };
    }
}