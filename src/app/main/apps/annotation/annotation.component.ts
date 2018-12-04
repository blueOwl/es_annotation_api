import { Component, OnInit } from '@angular/core';
import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';

@Component({
  selector: 'ann-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  constructor(public noctuaMenuService: NoctuaMenuService) { }

  ngOnInit() {
  }

}
