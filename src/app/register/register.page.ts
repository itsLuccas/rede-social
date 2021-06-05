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

// Importando o serviço de armazenamento offline
import { Storage } from '@ionic/storage';

import Swal from 'sweetalert2';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  username: string = "";
  loginName: string = "";
  password: string = "";
  cpassword: string = "";
  peso: number;
  litrosDia: number;


  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public user: UserService,
    public afStore: AngularFirestore, // essa variável permite o uso do angular firestore 
    private storage: Storage,
    private alert: AlertService
  ) { }

  ngOnInit() {
  }

  async signup() {
    const { username, loginName, password, cpassword, peso, litrosDia = peso * 0.035 } = this;

    if (password !== cpassword) {
      this.alert.error('Senhas não coincidem!');
      return console.error("Passwords don't match!");
    }

    if (peso === undefined || loginName === undefined || username === undefined || password === undefined || cpassword === undefined) {
      this.alert.error('Por favor, preencha todos os campos.');
      return console.error("Peso erro!!!!!");
    }

    try {
      // uso da variável afAuth que permite a autenticação do usuário
      const res = await this.afAuth.createUserWithEmailAndPassword(loginName + '@luccas.com', password);

      // estamos criando um documento no banco de dados, que possui a coleção de usuários através da utilização do .doc (acessa o documento) e do .set (seta o usuário conforme o id)
      this.afStore.doc(`/users/${res.user.uid}`).set({
        username,
        //DEFAULT IMG
        avatar: "d6bc7f8a-f012-469b-b8c6-e62d44c098b8",
        peso,
        litrosDia
      })

      //Se um usuário existir, então entramos no if e setamos um usuário
      if (res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid,
          peso          
        })
      }

      //Armazenando no local storage o id, para caso exista um refresh da página!
      this.storage.set('id', res.user.uid);
      if (await this.storage.get(`litrosHj_${res.user.uid}`) === null) {
        this.storage.set(`litrosHj_${res.user.uid}`, 0);
      }
      //Antes estava com o local storage, deixei p/ caso de algum erro durante testes!
      //window.localStorage.removeItem('id'); 
      //window.localStorage.setItem('id', res.user.uid); 

      //Mostrando um alerta de sucesso!
      this.alert.success('Sua conta foi criada!');

      // usuário criado, setado e registrado no banco de dados, agoar só basta redirecionarmos a página para o menu principal
      this.router.navigate(['/tabs/feed'])

    } catch (err) {
      console.dir(err);
      if (err.code == "auth/invalid-email") {
        this.alert.error('Formato de username errado!');
      } else if (err.code == "auth/weak-password") {
        this.alert.warning('A senha deve ter no mínimo 6 caracteres!');
      } else if (err.code == "auth/email-already-in-use") {
        this.alert.warning('Esse username já está sendo utilizado!')
      }
    }
  }

  async presentExplanation() {
    this.alert.question('Por que precisamos do seu peso?', "Para saber a quantidade de água exata que você precisa tomar por dia, a primeira coisa a se fazer é analisar o seu peso. O cálculo a ser feito é de 35 ml de água multiplicado pelo peso corporal de cada um. Então vamos levar em consideração uma pessoa que pese 60 kg e não sabe quanta água ela precisa tomar por dia. A conta seria a seguinte: 60 x 0,035 = 2,1L");
  }
}
