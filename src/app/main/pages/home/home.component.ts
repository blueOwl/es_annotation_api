import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDrawer } from '@angular/material';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';


import { NoctuaMenuService } from '@noctua.common/services/noctua-menu.service';
import { locale as english } from './i18n/en';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('leftDrawer')
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer')
  rightDrawer: MatDrawer;

  searchCriteria: any = {};
  searchForm: FormGroup;
  leftPanelMenu;

  constructor(private noctuaTranslationLoader: NoctuaTranslationLoaderService,
    public noctuaMenuService: NoctuaMenuService,
    private route: ActivatedRoute,
    private router: Router) {
    this.noctuaTranslationLoader.loadTranslations(english);

    this.leftPanelMenu = this.noctuaMenuService.leftPanelMenu;
  }

  ngOnInit() {
    this.noctuaMenuService.setLeftDrawer(this.leftDrawer);
    this.noctuaMenuService.setRightDrawer(this.rightDrawer);
  }
}
