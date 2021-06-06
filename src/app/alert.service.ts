import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app'
import { Storage } from '@ionic/storage';

@Injectable()
// definindo a classe usuário
export class AlertService {
    constructor(private afStore: AngularFirestore,
        private storage: Storage) {

    }

    input(uid: string, avatar: string, username: string) {
        Swal.fire({
            title: 'Digite seu comentário',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Comentar',
            showLoaderOnConfirm: true,
            preConfirm: (text) => {
                // Setando um novo post                              
                this.afStore.doc(`users/${uid}`).set({
                    comentarios: firestore.FieldValue.arrayUnion({
                        username: username,
                        avatar: avatar,
                        desc: text
                    })
                }, { merge: true });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Seu post foi realizado com sucesso!",
                    imageUrl: "https://media1.tenor.com/images/6bf658d3c1df80990a0817b417b78155/tenor.gif?itemid=10503435"
                })
            }
        })
    }

    success(titulo: string) {
        //Mostrando um alerta de sucesso!
        Swal.fire({
            icon: 'success',
            title: titulo,
            position: "center-start"
        });
    }

    error(titulo: string) {
        Swal.fire({
            icon: 'error',
            title: titulo,
            backdrop: true,
            position: "center-start",
            showConfirmButton: true,
            didOpen: () => {
                Swal.hideLoading()
            }
        });
    }

    warning(titulo: string) {
        Swal.fire({
            icon: 'warning',
            title: titulo,
            backdrop: true,
            position: "center-start",
            showConfirmButton: true,
            didOpen: () => {
                Swal.hideLoading()
            }
        });
    }

    question(titulo: string, conteudo: string) {
        Swal.fire({
            icon: 'question',
            title: titulo,
            html: conteudo,
            backdrop: true,
            position: "center-start",
            showConfirmButton: true,
        })
    }

    image(url: string) {
        Swal.fire({
            title: 'Sucesso!',
            imageUrl: url,
            imageAlt: 'Custom image',
            icon: 'success'
        })
    }

    zoom(url: string, desc: string) {
        Swal.fire({
            imageUrl: url,
            imageAlt: 'Custom image',
            text: desc
        })
    }

    zoomBadge(url: string, desc: string) {
        Swal.fire({
            imageUrl: url,
            imageAlt: 'Custom image',
            text: desc,
            heightAuto: true
        })
    }

    mixin() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
        })
        return swalWithBootstrapButtons;
    }

    fire(swalWithBootstrapButtons: any, titulo: string, btnConfirm: string) {
        return swalWithBootstrapButtons.fire({
            title: titulo,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: btnConfirm,
            confirmButtonColor: '#00cc00',
            cancelButtonText: 'Não, cancelar.',
            cancelButtonColor: '#d33',
            reverseButtons: true,
            position: 'center-start'
        })
    }
}