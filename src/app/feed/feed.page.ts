import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../alert.service'
import { Storage } from '@ionic/storage';
import { UserService } from '../user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  $users: Observable<any[]>;
  $user: Observable<any>;
  skeleton: boolean = true;
  flagComments = Array().fill(false);


  constructor(private afStore: AngularFirestore,
    private alert: AlertService,
    private storage: Storage,
    private router: Router,
    public user: UserService) {
  }

  async ionViewWillEnter() {
    this.skeleton = true;
    // Acessa todos os usuários
    const users = this.afStore.collection<any>('users/');
    this.$users = users.valueChanges();

    // Acessa apenas um usuário, o logado
    const user = this.afStore.doc<any>(`users/${await this.storage.get('id')}`);
    this.$user = user.valueChanges();

    await this.delay(1000);
    this.skeleton = false;
  }

  comentar(uid: string, avatar: string, username: string) {
    this.alert.input(uid, avatar, username);
  }

  giveLike(uid: string, qtdLike: any) {  
    this.alert.image("https://24.media.tumblr.com/89a8b51c087c4b7e691ee8b83e298a43/tumblr_mrbrdxQx8H1szx1oxo1_500.gif");
    if(qtdLike === undefined || qtdLike == null || qtdLike == "undefined"){
      qtdLike = 0;
    }
    this.user.like(uid, qtdLike);    
  }

  showComments(i: number) {
    if (this.flagComments[i] == true) {
      this.flagComments[i] = false;
    } else {
      this.flagComments[i] = true;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async visitarPerfil(uid: string) {
    if (uid == await this.storage.get("id")) {
      this.router.navigate(['tabs/profile']);
    } else {
      this.storage.set("idVisita", uid);
      this.router.navigate(['friend-profile']);
    }

  }

  ngOnInit() {
  }
}
