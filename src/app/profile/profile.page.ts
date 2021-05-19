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
import { AlertController } from '@ionic/angular';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  
  public nCols: 3 | 1;
  userPosts;

  

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;

  constructor(public http: HttpClient, private afStore: AngularFirestore, private user: UserService, private storage: Storage, private alert: AlertController, public router: Router) {}

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

  
  deleteImg(post){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#00cc00',
      cancelButtonText: 'No, cancel!',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success',
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
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
    Swal.fire({
      position: 'top-start',
      icon: 'success',
      title: 'Avatar atualizado',
      showConfirmButton: false,
      timer: 1500,
      backdrop: false
    })
  }
  
  ngOnInit() {
    this.accessDoc(); 
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
