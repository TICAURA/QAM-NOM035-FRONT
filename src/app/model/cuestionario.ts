export class Cuestionario {
    id:number;
    nombre:string;
    descripcion:string;
    total:number;
    respondidas:number;
    completo:boolean;
    build(content:any){
        this.id = content.idCuestionario;
        this.nombre = content.nombre;
        this.descripcion = content.descripcion;
        this.total = content.total;
        this.respondidas = content.respondidas;
        this.completo = content.completo;
    }
}
