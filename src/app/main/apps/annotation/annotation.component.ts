import { Component, OnInit } from '@angular/core';
import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';
import { Annotation, AnnotationNode, AnnotationFlatNode } from './models/annotation'
import { SelectionModel } from '@angular/cdk/collections';
import { SnpService } from './../snp/services/snp.service'

import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'ann-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  checklistSelection = new SelectionModel<AnnotationFlatNode>(true);
  annotationForm: FormGroup;

  constructor(public noctuaMenuService: NoctuaMenuService,
    public snpService: SnpService) {
    this.annotationForm = this.createAnnotationForm();
  }

  ngOnInit() {
  }

  createAnnotationForm() {
    return new FormGroup({
      chrom: new FormControl(18),
      start: new FormControl(10),
      end: new FormControl(500000),
    });
  }

  submit() {
    let query = this.annotationForm.value;
    let annotations = this.checklistSelection.selected as any[];
    let headers = annotations.reduce((annotationString, item) => {
      return annotationString + ' ' + item.id
    }, []);

    query['headers'] = headers.trim()
    this.snpService.getSnps(query);
  }
}
