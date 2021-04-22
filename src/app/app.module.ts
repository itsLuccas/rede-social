import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importando as configurações de autenticação do firebase, para permitir o acesso a esta ferramenta!
import firebaseConfig from './firebase'

// Importando algumas bibliotecas importantes, que possuem alguns comandos do firebase p/ angular!
import {AngularFireModule} from '@angular/fire';

import { AngularFireAuthModule } from  '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'

// Importando as bibliotecas de http do angular 
import { HttpClientModule } from '@angular/common/http'


// Importanto a definição da classe do usuário como um "provedor"
import { UserService } from './user.service';
import { from } from 'rxjs';
import { DatePipe } from '@angular/common';







@NgModule({
  declarations: [AppComponent],
  entryComponents: [], 
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    // Inicializando o módulo de autenticação do firebase!
    AngularFireAuthModule,    
    AngularFirestoreModule,
    // Inicializando o firebase no aplicativo, com as configurações de autenticação passadas na importação de cima!
    AngularFireModule.initializeApp(firebaseConfig),    
    // Inicializando o módulo do http
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, UserService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
