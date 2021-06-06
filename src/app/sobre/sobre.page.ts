import { Component, OnInit, Renderer2, RendererFactory2, ElementRef } from '@angular/core';
// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
// importando o usuário!
import { UserService } from '../user.service';
import { AnimationController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {
  private renderer: Renderer2;
  public $users: Observable<any[]>;

  oqueShown = false;
  quantosShown = false;

  constructor(public router: Router, private rendererFactory: RendererFactory2, private el: ElementRef, private afStore: AngularFirestore, private user: UserService, private storage: Storage) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const users = this.afStore.collection<any>(`users/`);
    this.$users = users.valueChanges();
  }

   addBodyClass(bodyClass) {
    this.renderer.addClass(this.el.nativeElement, bodyClass);
  }
  removeBodyClass(bodyClass) {
    this.renderer.removeClass(this.el.nativeElement, bodyClass);
  }

  oqueClick(){
    this.renderer.setAttribute(this.el.nativeElement, 'position', 'top');
    this.oqueShown = !this.oqueShown;
    this.quantosShown = false;
  }

  quantosClick(){
    this.renderer.setAttribute(this.el.nativeElement, 'position', 'top');
    this.quantosShown = !this.quantosShown;
    this.oqueShown = false;
  }

  login() {
    this.router.navigate(['login']);
  }
  register() {
    this.router.navigate(['register']);
  }

  ngOnInit() {
    
  }

}
