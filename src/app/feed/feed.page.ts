import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  $users: Observable<any[]>;
  skeleton: boolean = true;

  constructor(private afStore: AngularFirestore, private storage: Storage, private router: Router) {
  }

  async ionViewWillEnter() {
    this.skeleton = true;
    const users = this.afStore.collection<any>('users/');
    this.$users = users.valueChanges();
    await this.delay(1000);
    this.skeleton = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  visitarPerfil(uid: string){
    this.storage.set("idVisita", uid);
    this.router.navigate(['friend-profile']);
  }

  ngOnInit() {
  }
}