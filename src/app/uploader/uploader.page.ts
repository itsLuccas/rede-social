import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string;
  desc: string;
  $user: Observable<any>;
  rangeValue: number = 0;
  aguaDia: number = 0;

  // view child para ver as ids do css
  @ViewChild('fileButton') fileButton;

  constructor(private storage: Storage, 
              public http: HttpClient, 
              public afStore: AngularFirestore, 
              public user: UserService, 
              public alert: AlertService, 
              public datePipe: DatePipe) {
    
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
      const user = this.afStore.doc<any>(`users/${await this.storage.get('id')}`);
      this.$user = user.valueChanges();
      this.aguaDia = await this.storage.get(`litrosHj_${await this.storage.get('id')}`);
  }

  async postar(aguaTotal: any) {
    if(aguaTotal === undefined || aguaTotal == null || aguaTotal == "undefined"){
      aguaTotal = 0;
    } 

    // armazena a URL da imagem que teve seu upload feito no uploadcare
    const imagem = this.imageURL;

    const date = this.datePipe.transform(new Date(), 'medium');

    // armazena a descrição feita no post
    let desc = this.desc;
    if (!desc) {
      desc = " ";
    }

    // Setando um novo post
    this.afStore.doc(`users/${await this.storage.get('id')}`).set({
      posts: firestore.FieldValue.arrayUnion({
        imagem,
        desc,
        date
      }),
      aguaTotalConsumida: (parseInt(aguaTotal) + this.rangeValue)
    }, { merge: true });

    //Responsável por apagar os antigos comentários do último post!
    this.afStore.doc(`users/${await this.storage.get('id')}`).set({
      comentarios: ""
    }, {merge: true});

    //Responsável por apagar os antigos likes do último post!
    this.afStore.doc(`users/${await this.storage.get('id')}`).set({
      like: 0
    }, {merge: true});

    this.alert.image(`https://ucarecdn.com/${this.imageURL}/`);

    //Volta a imagem pra null, sendo assim o HTML volta a apresentar o botão "carregar imagem"
    this.imageURL = null;

    //Reponsável por armazenar a água bebida
    this.storage.set(`litrosHj_${await this.storage.get('id')}`, await this.storage.get(`litrosHj_${await this.storage.get('id')}`) + this.rangeValue);
    
    //Atualiza a quantidade de água bebida no HTML
    this.aguaDia = await this.storage.get(`litrosHj_${await this.storage.get('id')}`);
    
    //Reseta a quantidade de água
    this.desc = ""
  }

  async resetAgua() {
    const swalWithBootstrapButtons = this.alert.mixin();

    this.alert.fire(swalWithBootstrapButtons, 'Você deseja resetar a quantidade de água ingerida hoje?', 'Sim, resetar.').then(async (result) => {
      if (result.isConfirmed) {
        this.storage.set(`litrosHj_${await this.storage.get('id')}`, 0);
        this.aguaDia = 0;
        swalWithBootstrapButtons.fire(
          'Quantidade consumida de água resetada!',
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado!',
        )
      }
    })
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

    this.http.post('https://upload.uploadcare.com/base/', data)
      .subscribe(event => {
        this.imageURL = JSON.parse(JSON.stringify(event)).file;
      })
  }
}