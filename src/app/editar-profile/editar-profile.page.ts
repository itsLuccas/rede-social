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

  public userPosts: Observable<any>;
  public username;
  public biografia;
  public peso;
  public litrosDia;

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;;

  constructor(private afStore: AngularFirestore, private storage: Storage, private http: HttpClient, private alert: AlertService) {
    this.accessDoc();
  }

  async accessDoc() {
    // pegando os posts do usuário logado!    
    const posts = this.afStore.doc<any>(`users/${await this.storage.get('id')}`);
    //const posts = this.afStore.doc(`users/${await this.storage.get('id')}`).get();
    // é um observador, serve para pegar as alterações de posts quando um novo post é realizado, por isso o valueChanges()
    // retorna o doc "posts" do usuário
    this.userPosts = posts.valueChanges();
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
    if (this.username === undefined || this.username === "") {
      this.alert.error('Campo usuário vazio!');
    } else {
      this.afStore.doc(`users/${await this.storage.get('id')}`).update({
        username: this.username,
      })
      this.username = "";
      this.alert.success('Alteração feita com sucesso!');
    }
  }

  public async salvarBiografia() {
    if (this.biografia === undefined || this.biografia === "") {
      this.alert.error('Campo biografia vazio!');
    } else {
      this.afStore.doc(`users/${await this.storage.get('id')}`).set({
        biografia: this.biografia,
      }, { merge: true })
      this.biografia = "";
      this.alert.success('Alteração feita com sucesso!');
    }

  }

  public async salvarPeso() {
    if (this.peso === undefined || this.peso === "") {
      this.alert.error('Campo peso vazio!');
    } else {
      this.litrosDia = this.peso * 0.035;
      this.afStore.doc(`users/${await this.storage.get('id')}`).set({
        litrosDia: this.litrosDia,
        peso: this.peso,
      }, { merge: true })
      this.peso = "";
      this.alert.success('Alteração feita com sucesso!');
    }

  }

  ngOnInit() {
  }

}
