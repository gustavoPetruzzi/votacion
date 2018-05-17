import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, ToastController, NavParams, ModalController } from 'ionic-angular';
import { votacion } from '../../clases/votacion';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { opcion } from '../../clases/opcion';
import { Usuario } from '../../clases/usuario';
import { ModalPage }from '../modal/modal';
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
  usuario:Usuario = new Usuario();
  

  
  constructor
  ( public navCtrl: NavController, 
    
    private actionCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private params: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController) 
  {
    /*
    this.opcion1 = new opcion("Plantas", "Ponemos plantas?", this.imagenes + "hoja.png");
    this.opcion2 = new opcion("Matafuegos", "Ponemos Matafuegos?", this.imagenes + "matafuegos.png");
    this.votacion = new votacion(this.opcion1, this.opcion2);
    */
    console.log(this.usuario);
    this.usuario = this.params.get('usuario');
    this.votacion = this.params.get('votacion');
    console.log(this.votacion);
    console.log(this.usuario);
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
    if(!this.votacion.cerrada){
      if(!(this.votacion.usuarios.indexOf(this.usuario.nombre) > -1)){
        this.votacion.usuarios.push(this.usuario.nombre);
        opcion.positivos +=1;
        
        let fondo = `
        <div>
          <ion-row text-center>
            <img src="assets/imgs/voto.png">
            
          </ion-row>
          <ion-row>
            <h3> Guardando voto... </h3>
          </ion-row> 
        </div> `;
        let guardando = this.esperar(fondo);
        guardando.present();
        //Guardo votos
        this.firestore.collection('opciones')
        .doc(this.votacion.idOpciones)
        .set(
        {opcion:[
          {imagen:this.votacion.opciones[0].imagen, titulo: this.votacion.opciones[0].titulo, positivos: this.votacion.opciones[0].positivos, pregunta: this.votacion.opciones[0].pregunta},
          {imagen:this.votacion.opciones[1].imagen, titulo: this.votacion.opciones[1].titulo, positivos: this.votacion.opciones[1].positivos, pregunta: this.votacion.opciones[1].pregunta},]},
        { merge: true })
        .then( res =>{
          this.firestore.collection('votacion')
          .doc(this.votacion.id)
          .set({
            usuarios:this.votacion.usuarios,
            votacion: this.votacion.cerrada,
          })
          .then(res =>{
            guardando.dismiss();
          })
        })
        
      }
      else{
        let fondo = `
          <div>
            <ion-row text-center>
              <img src="assets/imgs/yaVoto.png">
              
            </ion-row>
            <ion-row>
              <h3> Error! ya voto usted! </h3>
            </ion-row> 
          </div> `;
          let guardando = this.esperar(fondo);
          guardando.present();
          setTimeout(function() {
            guardando.dismiss();
          }, 3000);
      }
    }
    else{
      let cerrada = `
      <div>
        <ion-row text-center>
          <img src="assets/imgs/yaVoto.png">
        </ion-row>
        <ion-row text-center>
           <h3> Error! votacion ya cerrada! </h3>
        </ion-row>
      </div> `;
      let votacionCerrada = this.esperar(cerrada);
      votacionCerrada.present();
      setTimeout(function() {
        votacionCerrada.dismiss();
      }, 3000);
    }
  }

  esperar(personalizado?:string) {
    let loading;
    if(!personalizado){
      loading = this.loadingCtrl.create({

        content: 'Por favor, espere...'
      });
    }
    else{
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    return loading;
  }

  cerrar(){
    if(!this.votacion.cerrada){
      let accion = this.actionCtrl.create({
        title:"¿Desea cerrar la Votacion?",
        buttons:  [
          {
            text:'Si',
            role:'destructive',
            handler: () =>{
              if(!this.votacion.cerrada){
                this.firestore.collection('votacion')
                .doc(this.votacion.id)
                .set({
                  cerrada:true,
                  usuarios: this.votacion.usuarios
                })
                .then(res =>{
                  console.log("CERRADA");
                  this.votacion.cerrada = true;
                })
              }else{
                console.log("Ya estaba cerrada");
              }
            }
          },
          {
            text:'No',
            handler:() => {
              console.log("nada");
            }
          },
          {
            text:'Cancelar',
            role:'cancel',
            handler:() => {
              console.log("Cancelar");
            }
          }
        ]
      })
      accion.present();  
    }
    else{
      console.log("Ya estaba cerrada");
    }
  }

  resultados() {
    
    let modal = this.modalCtrl.create(ModalPage,{votacion: this.votacion});
    modal.present();
    console.log("ALGO");
  }

}
