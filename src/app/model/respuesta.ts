export class Respuesta {

    idCuestionario:number;
    idPregunta:number;
    idTipoPregunta:number;
  
    build(content:any){
        this.idPregunta = content.idPregunta;
        this.idCuestionario = content.idCuestionario;
        this.idTipoPregunta = content.idTipoPregunta;
    }
}
