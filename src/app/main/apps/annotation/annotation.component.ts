import { Component, OnInit } from '@angular/core';
import { PantherMenuService } from '@panther.common/services/panther-menu.service';

@Component({
  selector: 'ann-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  constructor(public pantherMenuService: PantherMenuService) { }

  ngOnInit() {
  }

}
