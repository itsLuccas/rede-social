// esse import permite que esse serviço, como um todo, seja injetável em outras regiões do código (outros componentes)
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Storage } from '@ionic/storage';


// criando uma interface que contém os dados do usuário! 
interface user {
    username: string, // não me permitiu usar nome, apenas username
    uid: string,
    peso: number
}

@Injectable()
// definindo a classe usuário
export class UserService {
    private user: user;
    public username: string;

    constructor(private afAuth: AngularFireAuth, private storage: Storage) {

    }

    async getUsername() {
        return await this.storage.get("username");
    }

    async setUsername(username: String) {
        await this.storage.set("username", username);
    }

    setUser(user: user) {
        this.user = user;
    }

    getUID() {       
        return this.user.uid;                
    }
}