import { Component, OnInit } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';

// importando o usuário!
import { UserService } from '../user.service';

import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs';
import { createAnimation, Animation } from '@ionic/core';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  allUsers: Observable<any[]>;
  skeleton: boolean = true;

  constructor(private afStore: AngularFirestore, private user: UserService, private router: ActivatedRoute) {
    this.skeleton = true;
    this.router.params.subscribe(async () => {
      this.skeleton = true;
      const users = this.afStore.collection<any>('users/');
      this.allUsers = users.valueChanges();
      await this.delay(1000);
      this.skeleton = false;
    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms));
  }

  ngOnInit() {
  }
}