import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { votacion } from '../../clases/votacion';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { opcion } from '../../clases/opcion';
import { Usuario } from '../../clases/usuario';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  opcion1: opcion;
  opcion2: opcion;
  votacion: votacion = new votacion();
  votacionAux: votacion;
  imagenes: string = "assets/imgs/";
  coleccionTipadaFirebase:AngularFirestoreCollection<votacion>;
  ListadoDeChatsObservable:Observable<votacion[]>;
  usuario:Usuario;
  

  
  constructor
  ( public navCtrl: NavController, 
    
    private actionCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private params: NavParams) 
  {
    /*
    this.opcion1 = new opcion("Plantas", "Ponemos plantas?", this.imagenes + "hoja.png");
    this.opcion2 = new opcion("Matafuegos", "Ponemos Matafuegos?", this.imagenes + "matafuegos.png");
    this.votacion = new votacion(this.opcion1, this.opcion2);
    */
    this.usuario = this.params.get('usuario');
    this.votacion = this.params.get('votacion');
    console.log(this.votacion);
    
  }

  toaster(mensaje:string){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
    return toast;
  }
    
  votar(opcion:opcion){
    if(!(this.votacion.usuarios.indexOf(this.usuario.nombre) > -1)){
      this.votacion.usuarios.push(this.usuario.nombre);
      opcion.positivos +=1;
      //Guardo votos
      this.firestore.collection('opciones')
      .doc(this.votacion.idOpciones)
      .set(
      {opcion:[
        {imagen:this.votacion.opciones[0].imagen, titulo: this.votacion.opciones[0].titulo, positivos: this.votacion.opciones[0].positivos, pregunta: this.votacion.opciones[0].pregunta},
        {imagen:this.votacion.opciones[1].imagen, titulo: this.votacion.opciones[1].titulo, positivos: this.votacion.opciones[1].positivos, pregunta: this.votacion.opciones[1].pregunta},]},
      { merge: true })
      this.firestore.collection('votacion')
      .doc(this.votacion.id)
      .set({usuarios:this.votacion.usuarios})
    }
    else{
      let yaVoto = this.toaster("ERROR! Usted ya voto");
      yaVoto.present();
    }
  }
  /*
  resultados(vot:votacion) {
    let subTitulos = "Votos positivos: " + vot.positivos;
    let alerta = this.alertCtrl.create({
      title: "Resultados",
      subTitle: subTitulos,
      buttons:['OK'],
      cssClass:'alertCustomCss'
    })
    alerta.present();
  }
  */

}
