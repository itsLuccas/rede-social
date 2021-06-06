import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';



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
  constructor(public user: UserService, 
              public router: Router) { }

  ngOnInit() {
  }

  async login() {
    this.user.login(this.loginName, this.password);
    this.loginName = "";
    this.password = "";    
  } 
  
  register() {
    this.router.navigate(['register']);
  }

}
