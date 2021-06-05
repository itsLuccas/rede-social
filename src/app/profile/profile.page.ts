import { Component, OnInit, ViewChild } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';

// importando o usuário!
import { UserService } from '../user.service';

import { Storage } from '@ionic/storage';

// Importando o serviço de roteamento do próprio angular
import { Router, ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http'


import { firestore } from 'firebase';


// Serve para fechar o menu, após clicar em "Sair()"
import { MenuController } from '@ionic/angular';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AlertService } from '../alert.service';
import { switchMap } from 'rxjs/operators';
//animação
import { createAnimation, Animation } from '@ionic/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public nCols: 3 | 1;
  public userPosts: Observable<any>;
  public allUsers: Observable<any[]>;
  //
  skeleton: boolean = true;

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;

  constructor(public http: HttpClient, private afStore: AngularFirestore, private user: UserService, private storage: Storage, public router: Router, private aRoute: ActivatedRoute, private menu: MenuController, private alert: AlertService) {
    const users = this.afStore.collection<any>(`users/`);
    this.allUsers = users.valueChanges();
  }

  ionViewWillEnter() {
    this.accessDoc();
  }

  async accessDoc() {
    this.skeleton = true;      
    await this.delay(1000);
    this.skeleton = false;
    // pegando os posts do usuário logado!    
    const posts = this.afStore.doc<any>(`users/${await this.storage.get('id')}`);
    //const posts = this.afStore.doc(`users/${await this.storage.get('id')}`).get();
    // é um observador, serve para pegar as alterações de posts quando um novo post é realizado, por isso o valueChanges()
    // retorna o doc "posts" do usuário
    this.userPosts = posts.valueChanges();
  }

  sair() {
    this.storage.remove('id');
    this.menu.close();
    this.router.navigate(['/login']);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  uploadFile() {
    this.fileButton.nativeElement.click();
  }


  deleteImg(a: string, b: string, c: string) {
    let obj
    if (c === undefined) {
      obj = {
        imagem: a,
        desc: b
      }
    } else {
      obj = {
        imagem: a,
        desc: b,
        date: c
      }
    }

    const swalWithBootstrapButtons = this.alert.mixin();

    this.alert.fire(swalWithBootstrapButtons, 'Você deseja deletar esse post?', 'Sim, deletar.').then(async (result) => {
      if (result.isConfirmed) {
        this.afStore.doc(`users/${await this.storage.get('id')}`).update({
          posts: firestore.FieldValue.arrayRemove(obj)
        });
        swalWithBootstrapButtons.fire(
          'Deletado!',
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado!',
        )
      }
    })
  }

  fileChanged(event) {
    const files = event.target.files;


    // Criando uma estrutura de dados para publicar na API do uploadcare!
    const data = new FormData();

    data.append('file', files[0]);
    data.append('UPLOADCARE_PUB_KEY', 'b6677f56876ab7996079');
    data.append('UPLOADCARE_STORE', '1');

    // Tenho que descobrir o que significa isso!!!!!
    this.http.post('https://upload.uploadcare.com/base/', data)
      .subscribe(async event => {
        this.afStore.doc(`/users/${await this.storage.get('id')}`).update({
          // ATUALIZA IMG DE AVATAR
          avatar: JSON.parse(JSON.stringify(event)).file
        })
      })
    this.alert.success('Avatar atualizado');
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
