import { Component, OnInit, ViewChild } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';

// importando o usuário!
import { UserService } from '../user.service';

import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { firestore } from 'firebase';
import { MenuController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AlertService } from '../alert.service';



@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {

  public nCols: 3 | 1;
  public $user: Observable<any>;
  public $users: Observable<any[]>;
  //
  skeleton: boolean = true;

  constructor(public http: HttpClient, private afStore: AngularFirestore, private user: UserService, private storage: Storage, public router: Router, private aRoute: ActivatedRoute, private menu: MenuController, private alert: AlertService) {
    const users = this.afStore.collection<any>(`users/`);
    this.$users = users.valueChanges();
  }

  async ionViewWillEnter() {
    this.skeleton = true;      
    await this.delay(1000);
    this.skeleton = false;
       
    const user = this.afStore.doc<any>(`users/${await this.storage.get('idVisita')}`);    
    this.$user = user.valueChanges();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  zoom(url: string, desc: string) {
    this.alert.zoom(`https://ucarecdn.com/${url}/`, desc);
  }

  badge(pokemon: number){
    switch(pokemon){
      case 1:
        this.alert.zoomBadge("https://64.media.tumblr.com/tumblr_lnd0ngA3V21qdb5zco1_500.gif", "Você consumiu 500mL. Parabéns, sua jornada acaba de começar!");
        break;
      case 2:
        this.alert.zoomBadge("https://i.pinimg.com/originals/43/81/aa/4381aae009e34d092324d7cc1ccce92e.gif", "Você consumiu 1L. Derrotou o segundo líder do ginásio!");
        break;
      case 3:
        this.alert.zoomBadge("https://64.media.tumblr.com/d30cdfe9b5a5e7212069b35da18f7899/dfbf0f21f93b7bc7-1f/s640x960/bfa85be2b86abfc4d720f361191e108ffca530d7.gifv", "Você consumiu 1.5L. Você derrotou o primeiro inimigo do Team Desidratação!");
        break;
      case 4:
        this.alert.zoomBadge("https://i.pinimg.com/originals/6e/15/8b/6e158b0de583890d7eca925eb1784fbb.gif", "Você consumiu 2L. Seu rival tomou uma surra!");
        break;
      case 5:
        this.alert.zoomBadge("https://pa1.narvii.com/6217/57d65dd5843e3d705819954bf8238f0daec5ff0d_hq.gif", "Você consumiu 2.5L. Você já é forte o suficiente para se tornar um membro da Elite Four!");
        break;
      case 6:
        this.alert.zoomBadge("https://i.kym-cdn.com/photos/images/original/001/944/034/8fc.gif", "Você consumiu 3L. Você ascendeu ao nível Nirvana de água! Você e a água são um só!");
        break;
    }

  }

  ngOnInit() {
  }

}
