import { Component, OnInit } from '@angular/core';

// Importando as configurações de autentificação! 
import { AngularFireAuth } from '@angular/fire/auth';

//Importando as configurações de rota do próprio angular p/ alterar as páginas!
import { Router } from '@angular/router';

// Importando as configurações para se executar um alerta!
import { AlertController } from '@ionic/angular';

//Importando o serviço que define a classe usuário, criada anteriormente!
import { UserService } from '../user.service';

//Importando o serviço de armazenamento do firestore!
import { AngularFirestore } from '@angular/fire/firestore'

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  username: string = "";
  password: string = "";
  cpassword: string = "";


  constructor(
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public user: UserService,
    public afStore: AngularFirestore, // essa variável permite o uso do angular firestore 
    ) { }

  ngOnInit() {
  }

  async signup() {
    const { username, password, cpassword } = this;

    if(password !== cpassword) {
      this.showAlert("Error", "Passwords don't match!");
      return console.error("Passwords don't match!");
    } 

    try {
      // uso da variável afAuth que permite a autenticação do usuário
      const res = await this.afAuth.createUserWithEmailAndPassword(username + '@luccas.com', password); 
      
      // estamos criando um documento no banco de dados, que possui a coleção de usuários através da utilização do .doc (acessa o documento) e do .set (seta o usuário conforme o id)
      this.afStore.doc(`/users/${res.user.uid}`).set({
        username
      })

      //Se um usuário existir, então entramos no if e setamos um usuário
      if(res.user) {
          this.user.setUser({
          username,
          uid: res.user.uid
        })
      }
      
      //Mostrando um alerta de sucesso!
      this.showAlert("Success", "Your account has been created!");

      // usuário criado, setado e registrado no banco de dados, agoar só basta redirecionarmos a página para o menu principal
      this.router.navigate(['/tabs'])
    
    } catch(error) {
      console.dir(error);
      this.showAlert("Error", error.message);
    }  
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header, 
      message, 
      buttons: ['ok'],
      cssClass: 'foo',
    }) 
    await alert.present()
  }

}

