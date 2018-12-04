import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';




import 'rxjs/add/operator/map';

import * as _ from 'lodash';

import { Annotation, AnnotationNode, AnnotationFlatNode } from './../models/annotation'

@Injectable({
    providedIn: 'root',
})
export class AnnotationService {
    annotation: Annotation[];
    annotationNodes: AnnotationNode[];
    annotationDetail: any;
    activeAnnotation: any;
    onAnnotationTreeChanged: BehaviorSubject<any>;
    onAnnotationDetailChanged: BehaviorSubject<any>;

    constructor(private httpClient: HttpClient) {
        this.onAnnotationTreeChanged = new BehaviorSubject([]);
        this.onAnnotationDetailChanged = new BehaviorSubject({});
        //this.activeAnnotation = "LUCA";
    }

    /*
    "api/region/chr/1/start/3/end/2"
    "api/region?chr=1&start=3&end=2&header_idx=1 2 3"
*/
    getAnnotationList() {
        let api = environment.annotationTreeApi
        this.httpClient.get<Annotation[]>('api/annotation-list')
            .subscribe((response: Annotation[]) => {
                this.annotation = response;
                this.annotationNodes = this._buildAnnotationTree(this.annotation);
                this.onAnnotationTreeChanged.next(this.annotationNodes);
            });
    }

    getActiveAnnotation() {
        return this.activeAnnotation;
    }

    setActiveAnnotation(annotation: any) {
        this.activeAnnotation = annotation;
    }


    private _buildAnnotationTree(annotation: Annotation[]): AnnotationNode[] {
        let getNestedChildren = (arr, parent_id, level) => {
            let out = []
            for (let i in arr) {
                if (arr[i].parent_id == parent_id) {
                    let children = getNestedChildren(arr, arr[i].id, level++)

                    if (children.length) {
                        arr[i].children = children
                    }
                    out.push(arr[i])
                }
            }
            return out
        }

        return getNestedChildren(annotation, '', 1);
    }


    private _addHeirarchyLevel(annotationNodes: Annotation[]) {
        _.each(annotationNodes, function (annotationNode) {
            let level = 0;
            let parent = annotationNode;
            while (parent) {
                parent = _.find(annotationNodes, { id: parent.parent_id });
                level++;
            }
            // annotationNode.level = level;
        });
    }

}
