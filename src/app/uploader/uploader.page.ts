import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http'

// biblioteca que permite o uso do comando stringfy
import { stringify } from '@angular/compiler/src/util';

// serviço de armazenamento importado
import { AngularFirestore } from '@angular/fire/firestore';


// importando a estrutura do usuário
import { UserService } from '../user.service';

//
import { firestore } from 'firebase/app'

// Importando as configurações para se executar um alerta!
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';







@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string;
  desc: string;
  userData;
  rangeValue: number;
  aguaDia: number;

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;

  constructor(private storage: Storage, public http: HttpClient, public afStore: AngularFirestore, public user: UserService, public alert: AlertController, public datePipe: DatePipe, private aRoute: ActivatedRoute) {
    this.aRoute.params.subscribe(async () => {
      const fireUser = this.afStore.doc(`users/${await this.storage.get('id')}`);
      this.userData = fireUser.valueChanges();
      this.aguaDia = await this.storage.get(`litrosHj_${await this.storage.get('id')}`);        
    })
   }

  ngOnInit() { 
  }

  async postar() {
    // armazena a URL da imagem que teve seu upload feito no uploadcare
    const imagem = this.imageURL;
    
    const date = this.datePipe.transform(new Date(), 'medium');

    // armazena a descrição feita no post
    let desc = this.desc;
    if(!desc) {
      desc = " ";
    }      
    
    // acessamos o documento armazenado no banco de dados a partir do id do usuário atual e...
    // ...realizamos o update do doc com as informações de url e descrição    
    this.afStore.doc(`users/${await this.storage.get('id')}`).set({
      posts: firestore.FieldValue.arrayUnion({
        imagem, 
        desc,
        date
      })
    }, {merge: true});

    this.showAlert('ta ok ai?', 'teu post foi realizado com sucesso meu querido');
    this.imageURL = null;

    //Reponsável por armazenar a água bebida
    this.storage.set(`litrosHj_${await this.storage.get('id')}`, await this.storage.get(`litrosHj_${await this.storage.get('id')}`) + this.rangeValue);
    await this.delay(1000);
    this.aguaDia = await this.storage.get(`litrosHj_${await this.storage.get('id')}`);       
  }

  async resetAgua() {
    this.storage.set(`litrosHj_${await this.storage.get('id')}`, 0);
    this.aguaDia = 0;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  uploadFile() {
   this.fileButton.nativeElement.click();   
  }

  fileChanged(event) {
    const files = event.target.files;   
    
    // Criando uma estrutura de dados para publicar na API do uploadcare!
    const data = new FormData();
    data.append('file', files[0]);
    data.append('UPLOADCARE_PUB_KEY', 'b6677f56876ab7996079');
    data.append('UPLOADCARE_STORE', '1');
    
    //algumas public keys
    // - luccas b43fb80af5560135229d
    // - xofanna b6677f56876ab7996079

    // Tenho que descobrir o que significa isso!!!!!
    this.http.post('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {      
      this.imageURL = JSON.parse(JSON.stringify(event)).file;
    })
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header, 
      message, 
      buttons: ['ok']
    }) 
    await alert.present()
  }
}
