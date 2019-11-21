import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';
import { Annotation, AnnotationNode, AnnotationFlatNode } from './models/annotation'
import { SelectionModel } from '@angular/cdk/collections';
import { SnpService } from './../snp/services/snp.service';

import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AnnotationService } from './services/annotation.service';
import { SnpDialogService } from '../snp/services/dialog.service';
import { environment } from 'environments/environment';
import { SnpSearchService } from '../snp/services/search.service';

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
    private es: SnpSearchService,
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

  clear() {
    this.checklistSelection.clear();
  }

  submit() {
    let query = this.annotationForm.value;
    let annotations = this.checklistSelection.selected as any[];
    let headers = annotations.reduce((annotationString, item) => {
      return annotationString + ' ' + item.id
    }, []);

    if (headers.length > 0) {
      query['headers'] = headers.trim()
      // this.snpService.getSnps(query); 
      this.search('t', 'all', 1, annotations.map((ann) => {
        return ann.name;
      }));
    } else {
      this.snpDialogService.openMessageToast('Select at least one annotation from the tree', 'OK');
    }
  }

  /**
   * Elasticsearch misbehaves if users enter symbolic characters. User this method to strip out any such characters.
   * @param query - user search query.
   */
  static sanitized(query): string {
    return query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  }



  /**
   * Search function.
   * @param query - user input.
   * @param index - ES index to search.
   * @param page  - page.
   */
  search(query, index, page, headers) {
    const sanitized = AnnotationComponent.sanitized(query);
    //if (sanitized.length) {
    this.searchResponse = '';
    this.currentPage = page;
    // Search all indexes on ES
    console.log('snpData')
    if (index !== 'all') {
      this.es.getPaginatedDocuments(sanitized, page, index).then((body) => {
        if (body.hits.total > 0) {
          this.esData = body.hits.hits;
          const snpData = this.esData.map((snp) => {
            return snp._source;
          })

          console.log(snpData)
          this.totalHits = body.hits.total;
          this.searchTime = body.hits.time;
          this.totalPages = Array(Math.ceil(body.hits.total / this.PER_PAGE)).fill(4);
          this.snpService.onSnpsChanged.next(snpData);
        } else {
          this.searchResponse = 'No matches found';
        }
      }, (err) => {
        this.searchResponse = 'Oops! Something went wrong... ERROR: ' + err.error;
      });
    } else {
      this.es.getPaginatedDocuments(sanitized, page).then((body) => {
        if (body.hits.total.value > 0) {
          this.esData = body.hits.hits as [];
          //   this.totalHits = body.hits.total;
          //   this.searchTime = body.took;
          //  this.totalPages = Array(Math.ceil(body.hits.total / this.PER_PAGE)).fill(4);
          const snpData = this.esData.map((snp) => {
            return snp._source;
          })
          const data = {
            data: snpData,
            headers: headers
          }

          console.log(snpData)
          this.snpService.onSnpsChanged.next(data);
        } else {
          this.searchResponse = 'No matches found';
        }
      }, (err) => {
        this.searchResponse = 'Oops! Something went wrong... ERROR: ' + err.error;
      });
    }
    //   } else {
    //    this.searchResponse = 'Nothing found';
    //  }

  }

  nextPage(query: string, index: string) {
    const sanitized = AnnotationComponent.sanitized(query);
    if (sanitized.length) {
      if (this.currentPage < this.totalPages.length) {
        this.search(query, index, this.currentPage + 1);
      }
    } else {
      this.esData = [];
      this.searchResponse = 'Nothing found';
    }
  }

  previousPage(query: string, index: string) {
    const sanitized = AnnotationComponent.sanitized(query);
    if (sanitized.length) {
      if (this.currentPage - 1 >= 1) {
        this.search(query, index, this.currentPage - 1);
      }
    } else {
      this.esData = [];
      this.searchResponse = 'Nothing found';
    }
  }
}
