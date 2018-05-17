import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { votacion } from '../../clases/votacion';
import { opcion } from '../../clases/opcion';
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  votacion:votacion;
  opcion1:opcion;
  opcion2:opcion;
  usuarios:string[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.votacion = this.navParams.get('votacion');
    this.opcion1 = this.votacion.opciones[0];
    this.opcion2 = this.votacion.opciones[1];
    this.usuarios = this.votacion.usuarios;

  }

  cerrar(){
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log(this.votacion);
  }

}
