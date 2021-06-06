import { Component, OnInit, ViewChild } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http'

import Swal from 'sweetalert2';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-editar-profile',
  templateUrl: './editar-profile.page.html',
  styleUrls: ['./editar-profile.page.scss'],
})
export class EditarProfilePage implements OnInit {

  public $user: Observable<any>;
  public username;
  public biografia;
  public peso;
  public litrosDia;

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;;

  constructor(private afStore: AngularFirestore, 
              private storage: Storage, 
              private http: HttpClient, 
              private alert: AlertService) {
  }

  async ionViewWillEnter() {      
    const user = this.afStore.doc<any>(`users/${await this.storage.get('id')}`);    
    this.$user = user.valueChanges();
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

    // Tenho que descobrir o que significa isso!!!!!
    this.http.post('https://upload.uploadcare.com/base/', data)
      .subscribe(async event => {
        this.afStore.doc(`/users/${await this.storage.get('id')}`).update({
          // ATUALIZA IMG DE AVATAR
          avatar: JSON.parse(JSON.stringify(event)).file
        })
      })
    this.alert.success('Avatar atualizado');
  }

  public async salvarUsuario() {    
      this.afStore.doc(`users/${await this.storage.get('id')}`).update({
        username: this.username,
      })
      this.username = "";
      this.alert.success('Alteração feita com sucesso!');
      this.salvarPerfil();
  }

  public async salvarBiografia() {    
      this.afStore.doc(`users/${await this.storage.get('id')}`).set({
        biografia: this.biografia,
      }, { merge: true })
      this.biografia = "";
      this.alert.success('Alteração feita com sucesso!');
      this.salvarPerfil();
  }

  public async salvarPeso() {    
      this.litrosDia = this.peso * 0.035;
      this.afStore.doc(`users/${await this.storage.get('id')}`).set({
        litrosDia: this.litrosDia,
        peso: this.peso,
      }, { merge: true })
      this.peso = "";
      this.alert.success('Alteração feita com sucesso!');
      this.salvarPerfil();
  }

  public async salvarPerfil() {
    if (this.username != "" && this.username != undefined){
      this.salvarUsuario();
      
    }else if(this.biografia != "" && this.biografia != undefined){
    this.salvarBiografia();
  
    }else if(this.peso != "" && this.peso != undefined) {
    this.salvarPeso();    
    }    
  }

  ngOnInit() {
  }

}
