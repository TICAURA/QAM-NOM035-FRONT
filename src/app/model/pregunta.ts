export class Pregunta {
    id:number;
    idCuestionario:number;
    pregunta:string;
    servicioAlCliente:boolean;
    jefe:boolean;
    descendente:boolean;
    respondida:boolean;
    respuesta:number;
    build(content:any){
        this.id = content.idPregunta;
        this.idCuestionario = content.idCuestionario;
        this.pregunta = content.pregunta;
        this.servicioAlCliente = content.servicioAlCliente;
        this.jefe = content.jefe;
        this.descendente = content.descendente;
        this.respondida = false;
        this.respuesta = -1;
    }
}
