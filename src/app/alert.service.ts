// esse import permite que esse serviço, como um todo, seja injetável em outras regiões do código (outros componentes)
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
// definindo a classe usuário
export class AlertService {
    constructor() {

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

    fire(swalWithBootstrapButtons: any, titulo: string) {
        return swalWithBootstrapButtons.fire({
            title: titulo,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar.',
            confirmButtonColor: '#00cc00',
            cancelButtonText: 'Não, cancelar.',
            cancelButtonColor: '#d33',
            reverseButtons: true,
            position: 'center-start'
        })
    }
}