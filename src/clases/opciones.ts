import { opcion} from './opcion'
export class opciones {
    opcion:opcion[];
    id:string;

    constructor(titulo:string, pregunta:string, imagen:string){
        this.opcion = new Array();
    }
}