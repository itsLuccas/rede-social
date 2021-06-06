import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Storage } from '@ionic/storage';
import { AlertService } from './alert.service';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';


@Injectable()
// definindo a classe usuário
export class UserService {

    public username: string;

    constructor(private afAuth: AngularFireAuth,
        private storage: Storage,
        private alert: AlertService,
        private afStore: AngularFirestore,
        private router: Router) { }

    async login(loginName: string, password: string) {
        try {
            // Mandando a famosa gambiarra, pq o login é feito com email!!!!
            // const "result"
            //res recebe um objeto que possui a propriedade .user como resposta do serviço do firebase, por isso é possível acessar .user no if seguinte
            const res = await this.afAuth.signInWithEmailAndPassword(loginName + '@luccas.com', password);

            if (res.user) {
                //Armazenando no local storage o id, para caso exista um refresh da página!
                this.storage.set('id', res.user.uid);

                if (await this.storage.get(`litrosHj_${res.user.uid}`) === null) {
                    this.storage.set(`litrosHj_${res.user.uid}`, 0);
                }               
                
                //Mostrando um alerta de sucesso!
                this.alert.success("Logado!");

                //Redireciona para o feed
                this.router.navigate(['tabs/feed']);
            }
        } catch (err) {
            console.dir(err);
            if (err.code == "auth/user-not-found") {
                this.alert.error("O usuário não foi encontrado");
            } else if (password === '') {
                this.alert.warning("Campo senha não preenchido.");
            } else if (err.code == "auth/wrong-password") {
                this.alert.error("Senha incorreta!");
                console.log(password);
            } else if (err.code == "auth/invalid-email") {
                this.alert.warning("Campo usuário não preenchido.");
            }
        }
    }

    async signup(username: string, loginName: string, password: string, cpassword: string, peso: number, litrosDia: number) {
        if (password !== cpassword) {
            this.alert.error('Senhas não coincidem!');
            return console.error("Passwords don't match!");
        }

        if (peso === undefined || loginName === undefined || username === undefined || username === "" || password === undefined || cpassword === undefined) {
            this.alert.error('Por favor, preencha todos os campos.');
            return console.error("or favor, preencha todos os campos.");
        }

        try {
            // uso da variável afAuth que permite a autenticação do usuário
            const res = await this.afAuth.createUserWithEmailAndPassword(loginName + '@luccas.com', password);

            // estamos criando um documento no banco de dados, que possui a coleção de usuários através da utilização do .doc (acessa o documento) e do .set (seta o usuário conforme o id)
            this.afStore.doc(`/users/${res.user.uid}`).set({
                username,
                uid: res.user.uid,
                //DEFAULT IMG
                avatar: "d6bc7f8a-f012-469b-b8c6-e62d44c098b8",
                peso,
                litrosDia
            })

            //Armazenando no local storage o id, para caso exista um refresh da página!
            this.storage.set('id', res.user.uid);
            if (await this.storage.get(`litrosHj_${res.user.uid}`) === null) {
                this.storage.set(`litrosHj_${res.user.uid}`, 0);
            }            

            //Mostrando um alerta de sucesso!
            this.alert.success('Sua conta foi criada!');
            // usuário criado, setado e registrado no banco de dados, agoar só basta redirecionarmos a página para o menu principal
            this.router.navigate(['/tabs/feed']);

        } catch (err) {
            console.dir(err);
            if (err.code == "auth/invalid-email") {
                this.alert.error('Formato de username errado!');
            } else if (err.code == "auth/weak-password") {
                this.alert.warning('A senha deve ter no mínimo 6 caracteres!');
            } else if (err.code == "auth/email-already-in-use") {
                this.alert.warning('Esse username já está sendo utilizado!')
            }
        }
    }    

    like(uid: string, qtdLike: any) {
        this.afStore.doc(`users/${uid}`).set({
            like: parseInt(qtdLike) + 1
          }, { merge: true });
    }
}