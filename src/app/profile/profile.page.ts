import { Component, OnInit, ViewChild } from '@angular/core';

// importando o angular firestore pois precisamos da referência do usuário logado, para conseguirmos pegar seus posts!
import { AngularFirestore } from '@angular/fire/firestore';

// importando o usuário!
import { UserService } from '../user.service';

import { Storage } from '@ionic/storage';

// Importando o serviço de roteamento do próprio angular
import { Router, ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http'

// Serve para fechar o menu, após clicar em "Sair()"
import { MenuController } from '@ionic/angular'; 

// 
import { AlertController, IonButton } from '@ionic/angular'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  
  userPosts;    

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;

  constructor(public http: HttpClient, private afStore: AngularFirestore, private user: UserService, private storage: Storage, public router: Router, private aRoute: ActivatedRoute, private menu: MenuController, private alert: AlertController) {
    this.aRoute.params.subscribe(() => {
      this.accessDoc();       
    })
  }

   async accessDoc() {
    // pegando os posts do usuário logado!    
    const posts = this.afStore.doc(`users/${await this.storage.get('id')}`);
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
  }

  public nCols: 3 | 1;

  deleteImg(post: any){
    this.showAlert("Deseja excluir esta imagem?");
  }

  async showAlert(message: string) {
    const alert = await this.alert.create({
      message,
      buttons: ['Sim', 'Cancelar'], 
      cssClass: 'foo',
    }) 
    await alert.present()
  }

}
