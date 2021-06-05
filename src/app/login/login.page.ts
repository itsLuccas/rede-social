import { Component, OnInit } from '@angular/core';

// Importando as configurações de autentificação! 
import { AngularFireAuth } from '@angular/fire/auth';

//Importando o serviço que define a classe usuário, criada anteriormente!
import { UserService } from '../user.service';
import { AlertService } from '../alert.service';

// Importando o serviço de roteamento do próprio angular
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  
  loginName: string = "";
  password: string = "";
  peso: number;

  
  // instânciando o usuário no construtor, assim como os recursos do firebase
  constructor(public afAuth: AngularFireAuth, public user: UserService, public router: Router, private storage: Storage, private alert:AlertService) { }

  ngOnInit() {
  }

  // Preciso descobrir o que significa esse assíncrono!!!!
  async login() {

    const { loginName, password, peso } = this
    
    try {
      // Mandando a famosa gambiarra, pq o login é feito com email!!!!
      // const "result"
      //res recebe um objeto que possui a propriedade .user como resposta do serviço do firebase, por isso é possível acessar .user no if seguinte
      const res = await this.afAuth.signInWithEmailAndPassword(loginName + '@luccas.com', password);
     

      //Se um usuário existir, então entramos no if e setamos um usuário
      if(res.user) {
        


        //Armazenando no local storage o id, para caso exista um refresh da página!
        this.storage.set('id', res.user.uid);     
        

        if(await this.storage.get(`litrosHj_${res.user.uid}`) === null) {
          this.storage.set(`litrosHj_${res.user.uid}`, 0);
        }
        
        

        //window.localStorage.removeItem('id'); 
        //window.localStorage.setItem('id', res.user.uid); 

      //Mostrando um alerta de sucesso!
      this.alert.success("Logado!");
      this.loginName = "";
      this.password = ""; 
      // Depois do login, fazemos o roteamento para a página principal 
        this.router.navigate(['/tabs/feed']);
      }
      
    } catch(err) {
      console.dir(err);
      if(err.code == "auth/user-not-found") {
        this.alert.error("O usuário não foi encontrado");
      }else if(this.password === ''){
        this.alert.warning("Campo senha não preenchido.");
      }else if(err.code == "auth/wrong-password"){
        this.alert.error("Senha incorreta!");
        console.log(this.password);
      }else if(err.code == "auth/invalid-email"){
        this.alert.warning("Campo usuário não preenchido.");
      }
    }
  } 
  
  register() {
    this.router.navigate(['register']);
  }

}
