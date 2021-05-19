import { Component, OnInit } from '@angular/core';

// Importando as configurações de autentificação! 
import { AngularFireAuth } from '@angular/fire/auth';

//Importando o serviço que define a classe usuário, criada anteriormente!
import { UserService } from '../user.service';

// Importando o serviço de roteamento do próprio angular
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  
  username: string = ""
  password: string = ""

  
  // instânciando o usuário no construtor, assim como os recursos do firebase
  constructor(public afAuth: AngularFireAuth, public user: UserService, public router: Router) { }

  ngOnInit() {
  }

  // Preciso descobrir o que significa esse assíncrono!!!!
  async login() {
    const { username, password } = this
    Swal.fire({
      title: 'Carregando',
      imageUrl: 'https://imagehost7.online-image-editor.com/oie_upload/images/19221816vy632/oie_canvas.png',
      timer: 2500,
      timerProgressBar: true,
      backdrop: false,
      position: 'center-start',
      didOpen: () => {
        Swal.showLoading()
      }
    })
    
    try {
      // Mandando a famosa gambiarra, pq o login é feito com email!!!!
      // const "result"
      //res recebe um objeto que possui a propriedade .user como resposta do serviço do firebase, por isso é possível acessar .user no if seguinte
      const res = await this.afAuth.signInWithEmailAndPassword(username + '@luccas.com', password);

      //Se um usuário existir, então entramos no if e setamos um usuário
      if(res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid                   
        })

      //Armazenando no local storage o id, para caso exista um refresh da página!
        window.localStorage.removeItem('id'); 
        window.localStorage.setItem('id', res.user.uid); 
        
      //Mostrando um alerta de sucesso!
      Swal.fire({
        icon: 'success',
        title: 'Logado!',
        backdrop: false,
        position: "center-start"
      });
        
      // Depois do login, fazemos o roteamento para a página principal 
        this.router.navigate(['/tabs']);
      }
      
    } catch(err) {
      console.dir(err);
      if(err.code == "auth/user-not-found") {
        Swal.fire({
          icon: 'error',
          title: 'Usuário não encontrado!',
          backdrop: false,
          position: "center-start",
          didOpen: () => {
            Swal.hideLoading()
          }
        });
      }else if(this.password === ''){
        Swal.fire({
          icon: 'warning',
          title: 'Campo senha não preenchido.',
          backdrop: false,
          position: "center-start",
          didOpen: () => {
            Swal.hideLoading()
          }
        });
      }else if(err.code == "auth/wrong-password"){
        Swal.fire({
          icon: 'error',
          title: 'Senha incorreta!',
          backdrop: false,
          position: "center-start",
          didOpen: () => {
            Swal.hideLoading()
          }
        });
        console.log(this.password);
      }else if(err.code == "auth/invalid-email"){
        Swal.fire({
          icon: 'warning',
          title: 'Campo usuário não preenchido.',
          backdrop: false,
          position: "center-start",
          didOpen: () => {
            Swal.hideLoading()
          }
        });
      }
    }
    
    
  } 
  
  register() {
    this.router.navigate(['register']);
  }

}
