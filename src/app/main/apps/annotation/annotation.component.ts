import { Component, OnInit } from '@angular/core';
import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';
import { Annotation, AnnotationNode, AnnotationFlatNode } from './models/annotation'
import { SelectionModel } from '@angular/cdk/collections';
import { SnpService } from './../snp/services/snp.service'

import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AnnotationService } from './services/annotation.service';
import { SnpDialogService } from '../snp/services/dialog.service';

@Component({
  selector: 'ann-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  checklistSelection = new SelectionModel<AnnotationFlatNode>(true);
  annotationForm: FormGroup;

  constructor(public noctuaMenuService: NoctuaMenuService,
    private annotationService: AnnotationService,
    private snpDialogService: SnpDialogService,
    public snpService: SnpService) {
    this.annotationForm = this.createAnnotationForm();
  }

  ngOnInit() {
  }

  createAnnotationForm() {
    return new FormGroup({
      chrom: new FormControl(18),
      chromList: new FormControl(),
      geneProduct: new FormControl('Q8NBV4'),
      rsID: new FormControl('rs111739080'),
      start: new FormControl(1),
      end: new FormControl(500000),
      all: new FormControl(false),
      uploadList: new FormGroup({
        ids: new FormControl(),
        browse: new FormControl(),
      })
    });
  }

  onFileChange(event) {
    let reader = new FileReader();
    let ids = this.annotationForm.controls.uploadList['controls'].ids;

    //console.log(event, control)

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);

      reader.onload = () => {
        //    this.geneForm.patchValue({
        //   file: reader.result
        //   });
        // console.log(reader.result)
        ids.setValue(reader.result);
        // this.cd.markForCheck();
      };
    }
  }

  downloadConfig() {

    let annotations = this.checklistSelection.selected as any[];
    let headers = annotations.reduce((annotationString, item) => {
      return annotationString + ' ' + item.id
    }, []);

    if (headers.length > 0) {
      this.annotationService.downloadConfig(headers.trim());
    } else {
      this.snpDialogService.openMessageToast('Select at least one annotation from the tree', 'OK');
    }
  }

  submit() {
    let query = this.annotationForm.value;
    let annotations = this.checklistSelection.selected as any[];
    let headers = annotations.reduce((annotationString, item) => {
      return annotationString + ' ' + item.id
    }, []);

    if (headers.length > 0) {
      query['headers'] = headers.trim()
      this.snpService.getSnps(query);
    } else {
      this.snpDialogService.openMessageToast('Select at least one annotation from the tree', 'OK');
    }
  }
}
