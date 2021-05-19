import { Component, OnInit } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';

// importando o usuário!
import { UserService } from '../user.service';

import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  allUsers;
  
  constructor(private afStore: AngularFirestore, private user: UserService, private router: ActivatedRoute) {  
    this.router.params.subscribe(() => {      
      const users = afStore.collection(`users`);       
      this.allUsers = users.valueChanges();
    });    
  }

  ngOnInit() {        
  }
}
