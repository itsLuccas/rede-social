import { Component, OnInit, ViewChild } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';

// importando o usuário!
import { UserService } from '../user.service';

import { Storage } from '@ionic/storage';

// Importando o serviço de roteamento do próprio angular
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http'
import { firestore } from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  
  userPosts;    

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;

  constructor(public http: HttpClient, private afStore: AngularFirestore, private user: UserService, private storage: Storage, public router: Router) {}

   async accessDoc() {
    // pegando os posts do usuário logado!    
    const posts = this.afStore.doc(`users/${await this.storage.get('id')}`);
    // é um observador, serve para pegar as alterações de posts quando um novo post é realizado, por isso o valueChanges()
    // retorna o doc "posts" do usuário
    this.userPosts = posts.valueChanges();    
   }

   sair() {    
    this.storage.clear();
    this.router.navigate(['/login']);
   }

   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms));
  }


  uploadFile() {
    this.fileButton.nativeElement.click(); 
  }

   fileChanged(event) {
    const files = event.target.files;
    

    // Criando uma estrutura de dados para publicar na API do uploadcare!
    const data = new FormData();
    
    data.append('file', files[0]);
    data.append('UPLOADCARE_PUB_KEY', 'b43fb80af5560135229d');
    data.append('UPLOADCARE_STORE', '1');
    
    // Tenho que descobrir o que significa isso!!!!!
    this.http.post('https://upload.uploadcare.com/base/', data)
    .subscribe(async event => {      
      this.afStore.doc(`/users/${await this.storage.get('id')}`).update({      
        // ATUALIZA IMG DE AVATAR
        avatar: JSON.parse(JSON.stringify(event)).file
      }) 
    })
  }
  
  ngOnInit() {
    this.accessDoc(); 
  }

}
