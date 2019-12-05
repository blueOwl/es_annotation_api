import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';
import { Annotation, AnnotationNode, AnnotationFlatNode } from './models/annotation'
import { SelectionModel } from '@angular/cdk/collections';
import { SnpService } from './../snp/services/snp.service';

import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AnnotationService } from './services/annotation.service';
import { SnpDialogService } from '../snp/services/dialog.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'ann-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  checklistSelection = new SelectionModel<AnnotationFlatNode>(true);
  annotationForm: FormGroup;

  isConnected = false;
  status: string;
  totalHits: number;
  searchTime: number;
  currentPage: number;
  searchResponse = '';
  PER_PAGE = environment.esResultSize;
  totalPages: any;

  public esData: any[];

  constructor(public noctuaMenuService: NoctuaMenuService,
    private annotationService: AnnotationService,
    private snpDialogService: SnpDialogService,
    private cd: ChangeDetectorRef,
    public snpService: SnpService) {
    this.annotationForm = this.createAnnotationForm();
  }

  ngOnInit() {
    /*    this.es.isAvailable().then(() => {
       this.status = 'OK';
       this.isConnected = true;
     }, error => {
       this.status = 'ERROR';
       this.isConnected = false;
       console.error('Server is down', error);
     }).then(() => {
       this.cd.detectChanges();
     }); */
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



  clear() {
    this.checklistSelection.clear();
  }

  submit() {
    const query = this.annotationForm.value;
    const annotations = this.checklistSelection.selected as any[];
    const sources = annotations.map((item: AnnotationFlatNode) => {
      return item.name; //item.leaf ? item.name : false;
    }, []);

    query.sources = sources;

    console.log(query);

    if (sources.length > 0) {
      this.snpService.getSnps(query, 1);
    } else {
      this.snpDialogService.openMessageToast('Select at least one annotation from the tree', 'OK');
    }
  }




  onFileChange(event) {
    const reader = new FileReader();
    const ids = this.annotationForm.controls.uploadList['controls'].ids;

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
    const annotations = this.checklistSelection.selected as any[];
    const headers = annotations.reduce((annotationString, item) => {
      return annotationString + ' ' + item.id
    }, []);

    if (headers.length > 0) {
      this.annotationService.downloadConfig(headers.trim());
    } else {
      this.snpDialogService.openMessageToast('Select at least one annotation from the tree', 'OK');
    }
  }
}
