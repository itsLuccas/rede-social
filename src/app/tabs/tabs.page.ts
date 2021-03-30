import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})

export class TabsPage implements OnInit {

  @ViewChild('tabs', { read: IonTabs, static: false }) tabs: IonTabs;

  constructor() { }

  ngOnInit() {
    setTimeout(() => { this.tabs.select('feed') }, 1500)
  }
}
