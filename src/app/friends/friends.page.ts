import { Component, OnInit } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  public $users: Observable<any[]>;
  public $user: Observable<any>;

  constructor(private afStore: AngularFirestore, private storage: Storage, private alert: AlertService) { }


  async ionViewWillEnter() {
    const users = this.afStore.collection<any>('users/');
    this.$users = users.valueChanges();
    const user = this.afStore.doc<any>(`users/${await this.storage.get("id")}`);
    this.$user = user.valueChanges();
  }
 
  ngOnInit() {
  }

}
