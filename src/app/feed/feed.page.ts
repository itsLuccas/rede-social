import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AlertService } from '../alert.service'
import { Storage } from '@ionic/storage';

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
              private storage: Storage) {
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

  showComments(i: number) {
    if(this.flagComments[i] == true) {
      this.flagComments[i] = false;
    } else {
      this.flagComments[i] = true;
    }    
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit() {
  }
}