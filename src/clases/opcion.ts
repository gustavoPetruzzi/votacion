export class opcion {
    titulo:string;
    pregunta:string;
    imagen:string;
    positivos:number;

    constructor(titulo:string, pregunta:string, imagen:string){
        this.titulo = titulo;
        this.pregunta = pregunta;
        this.imagen = imagen;
        this.positivos = 0;
    }
}