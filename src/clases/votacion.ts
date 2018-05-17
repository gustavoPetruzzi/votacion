import { opcion } from './opcion';
export class votacion {
    id:string;
    idOpciones:string;
    opciones:opcion[];
    usuarios:string[];
    cerrada:boolean;
    constructor(opcion1?: opcion, opcion2?: opcion){
        this.usuarios = new Array();
        if(opcion1 && opcion2){
            this.opciones.push(opcion1);
            this.opciones.push(opcion2);
        }
        this.cerrada = false;
    }
}