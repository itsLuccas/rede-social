import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
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
    public user: UserService,     
    private alert: AlertService
  ) { }

  ngOnInit() {
  }

  async signup() {
    const { username, loginName, password, cpassword, peso, litrosDia = peso * 0.035 } = this;
    this.user.signup(username, loginName, password, cpassword, peso, litrosDia);       
  }

  async presentExplanation() {
    this.alert.question('Por que precisamos do seu peso?', "Para saber a quantidade de água exata que você precisa tomar por dia, a primeira coisa a se fazer é analisar o seu peso. O cálculo a ser feito é de 35 ml de água multiplicado pelo peso corporal de cada um. Então vamos levar em consideração uma pessoa que pese 60 kg e não sabe quanta água ela precisa tomar por dia. A conta seria a seguinte: 60 x 0,035 = 2,1L");
  }
}
