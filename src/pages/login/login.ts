import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage }from '../home/home';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';
import { votacion } from '../../clases/votacion';
import { opciones } from '../../clases/opciones';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  coleccionTipada: AngularFirestoreCollection<Usuario>;
  listadoUsuarios: Observable<Usuario[]>;

  coleccionTipadaVotacion: AngularFirestoreCollection<votacion>;
  listadoVotacion: Observable<votacion[]>;
  
  coleccionTipadaOpcion: AngularFirestoreCollection<opciones>;
  listadoOpcion: Observable<opciones[]>;
  
  opciones:opciones[];
  votacion:votacion;
  usuario:Usuario;
  usuarios:Usuario[];
  nombre: string="";
  pass: string="";
  constructor(
    public navCtrl: NavController, 
    

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    ) 
  {

  }


  creaFondo(mensaje, error){
    let fondo:string;
    if(error){
      fondo = `
          <div>
            <ion-row text-center>
              <img src="assets/imgs/error.png">
            </ion-row>
            <ion-row>
              <h3> ${mensaje} </h3>
            </ion-row> 
          </div> `;
    }
    return fondo;

  }


  ingresar(usuario:string){
    if(usuario){
      switch (usuario) {
        case 'admin':
          this.nombre = 'admin@gmail.com';
          this.pass = '11';
          this.login(usuario);
          break;
        case 'invitado':
          this.nombre = 'invitado@gmail.com';
          this.pass = '22';
          this.login(usuario);
          break;
        case 'usuario':
          this.nombre = 'usuario@gmail.com';
          this.pass = '33';
          this.login(usuario);
          break;
        case 'anonimo':
          this.nombre = 'anonimo@gmail.com';
          this.pass = '44';
          this.login(usuario);
          break;
        case 'tester':
          this.nombre = 'tester@gmail.com';
          this.pass = '55';
          this.login(usuario);
          break;
      
        default:
          this.login(this.nombre);
          break;
      }
    }
    else{
      this.login(this.nombre);
    }
  }

  async login(usuario?:string){
    let esperador = this.esperar();
    esperador.present();


    this.coleccionTipadaVotacion= this.firestore.collection<votacion>('votacion'); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    this.listadoVotacion=this.coleccionTipadaVotacion.snapshotChanges().map(actions =>{
      return actions.map(a => {
        const data = a.payload.doc.data() as votacion;
        const id = a.payload.doc.id;
        return { id, ...data};
      });
    })


    this.listadoVotacion.subscribe( votacion => {
      this.votacion = votacion[0];
    })

    this.coleccionTipadaOpcion= this.firestore.collection<opciones>('opciones'); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    this.listadoOpcion =this.coleccionTipadaOpcion.snapshotChanges().map(actions =>{
      return actions.map(a => {
        const data = a.payload.doc.data() as opciones;
        const id = a.payload.doc.id;
        return { id, ...data};
      });
    })

    
    this.listadoOpcion.subscribe( opciones => {
      this.votacion.idOpciones = opciones[0].id;
      this.votacion.opciones = new Array();
      opciones[0].opcion.forEach(element => {
        this.votacion.opciones.push(element);
      });
    })


    switch (usuario) {
      case 'admin':
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.nombre,'111111')
              .then( result =>{
                this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
                this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
                  return actions.map(a => {
                    const data = a.payload.doc.data() as Usuario;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                });
                this.listadoUsuarios.subscribe( datos =>{
                  datos.forEach(element => {
                    if(element.nombre == this.nombre){
                      this.usuario = element;
                      esperador.dismiss();
                    }
                  });
                })




                let fondo = `
                <div>
                  <ion-row text-center>
                    <img src="assets/imgs/logueado.png">
                    
                  </ion-row>
                  <ion-row>
                    <h3> Logueado correctamente! </h3>
                  </ion-row> 
                </div> `;
                let logueadoBien = this.esperar(fondo);
                logueadoBien.present();

                logueadoBien.onDidDismiss(() => {
  
                  this.navCtrl.setRoot(HomePage, { 
                    usuario: this.usuario,
                    votacion: this.votacion,
                  })
                  
                })
          
          
                setTimeout(function() {
                  logueadoBien.dismiss();  
                }, 1000);
                
              })
            .catch(error =>
              {
                esperador.dismiss();
                let errorCode = error.code;
                
                if(errorCode === 'auth/invalid-email'){
                  let loadingError = this.esperar(this.creaFondo("Mail invalido", true));
                    loadingError.present();
                    setTimeout(function() {
                    loadingError.dismiss();
                  }, 3000);
                }
              });
        break;
      case 'invitado':
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.nombre,'222222')
              .then( result =>{
                this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
                this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
                  return actions.map(a => {
                    const data = a.payload.doc.data() as Usuario;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                });
                this.listadoUsuarios.subscribe( datos =>{
                  datos.forEach(element => {
                    if(element.nombre == this.nombre){
                      this.usuario = element;
                      console.log(element);
                      console.log(this.usuario);
                      this.navCtrl.setRoot(HomePage, {usuario: this.usuario, votacion: this.votacion,})
                      esperador.dismiss();
                    }
                  });
                })
                esperador.dismiss();                
              })             
              .catch(error =>
                {
                  esperador.dismiss();
                  let errorCode = error.code;
                  
                  if(errorCode === 'auth/invalid-email'){
                    let loadingError = this.esperar(this.creaFondo("Mail invalido", true));
                      loadingError.present();
                      setTimeout(function() {
                      loadingError.dismiss();
                    }, 3000);
                  }
                });
        break;
      case 'usuario':
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.nombre,'333333')
              .then( result =>{
                this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
                this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
                  return actions.map(a => {
                    const data = a.payload.doc.data() as Usuario;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                });
                this.listadoUsuarios.subscribe( datos =>{
                  datos.forEach(element => {
                    if(element.nombre == this.nombre){
                      this.usuario = element;
                      console.log(element);
                      console.log(this.usuario);
                      this.navCtrl.setRoot(HomePage, {usuario: this.nombre, votacion: this.votacion})
                      esperador.dismiss();
                    }
                  });
                })
                esperador.dismiss();                
              })             
              .catch(error =>
                {
                  esperador.dismiss();
                  let errorCode = error.code;
                  
                  if(errorCode === 'auth/invalid-email'){
                    let loadingError = this.esperar(this.creaFondo("Mail invalido", true));
                      loadingError.present();
                      setTimeout(function() {
                      loadingError.dismiss();
                    }, 3000);
                  }
                });
        break;
      case 'anonimo':
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.nombre,'444444')
              .then( result =>{
                this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
                this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
                  return actions.map(a => {
                    const data = a.payload.doc.data() as Usuario;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                });
                this.listadoUsuarios.subscribe( datos =>{
                  datos.forEach(element => {
                    if(element.nombre == this.nombre){
                      this.usuario = element;
                      console.log(element);
                      console.log(this.usuario);
                      this.navCtrl.setRoot(HomePage, {usuario: this.usuario, votacion: this.votacion,})
                      esperador.dismiss();
                    }
                  });
                })
                esperador.dismiss();                
              })             
              .catch(error =>
                {
                  esperador.dismiss();
                  let errorCode = error.code;
                  
                  if(errorCode === 'auth/invalid-email'){
                    let loadingError = this.esperar(this.creaFondo("Mail invalido", true));
                      loadingError.present();
                      setTimeout(function() {
                      loadingError.dismiss();
                    }, 3000);
                  }
                });
        break;            
      case 'tester':
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.nombre,'555555')
              .then( result =>{
                this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
                this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
                  return actions.map(a => {
                    const data = a.payload.doc.data() as Usuario;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                });
                this.listadoUsuarios.subscribe( datos =>{
                  datos.forEach(element => {
                    if(element.nombre == this.nombre){
                      this.usuario = element;
                      console.log(element);
                      console.log(this.usuario);
                      this.navCtrl.setRoot(HomePage, {usuario: this.usuario, votacion: this.votacion,})
                      esperador.dismiss();
                    }
                  });
                })
                esperador.dismiss();                
              })             
              .catch(error =>
                {
                  esperador.dismiss();
                  let errorCode = error.code;
                  
                  if(errorCode === 'auth/invalid-email'){
                    let loadingError = this.esperar(this.creaFondo("Mail invalido", true));
                      loadingError.present();
                      setTimeout(function() {
                      loadingError.dismiss();
                    }, 3000);
                  }
                });
        break;
      default:
        await this.firebaseAuth.auth.signInWithEmailAndPassword(this.nombre,this.pass)
              .then( result =>{
                this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
                this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
                  return actions.map(a => {
                    const data = a.payload.doc.data() as Usuario;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                });
                this.listadoUsuarios.subscribe( datos =>{
                  datos.forEach(element => {
                    if(element.nombre == this.nombre){
                      this.usuario = element;
                      console.log(element);
                      console.log(this.usuario);
                      this.navCtrl.setRoot(HomePage, {usuario: this.usuario, votacion: this.votacion,})
                      esperador.dismiss();
                    }
                  });
                })
                esperador.dismiss();                
              })             
              .catch(error =>
                {
                  esperador.dismiss();
                  let errorCode = error.code;
                  
                  if(errorCode === 'auth/invalid-email'){
                    let loadingError = this.esperar(this.creaFondo("Mail invalido", true));
                      loadingError.present();
                      setTimeout(function() {
                      loadingError.dismiss();
                    }, 3000);
                  }
                  else{
                    console.log(errorCode); 
                  }
                });
        break;
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




  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
