import { Component, OnInit } from '@angular/core';

// Importando as configurações de autentificação! 
import { AngularFireAuth } from '@angular/fire/auth';

//Importando o serviço que define a classe usuário, criada anteriormente!
import { UserService } from '../user.service';

// Importando o serviço de roteamento do próprio angular
import { Router } from '@angular/router';



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
        
        
        // Depois do login, fazemos o roteamento para a página principal 
        this.router.navigate(['/tabs']);
      }
      
    } catch(err) {
      console.dir(err);
      if(err.code == "auth/user-not-found") {
        console.log("User not found!");
      }
    }
  } 

  register() {
    this.router.navigate(['register']);
  }

}
