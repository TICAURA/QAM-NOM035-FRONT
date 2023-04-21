import { Component, OnInit } from '@angular/core';
import { Pregunta } from 'src/app/model/pregunta';
import { Router, ActivatedRoute } from '@angular/router';
import { Errors } from 'src/app/utils/errors';
import { CuestionarioService } from 'src/app/service/cuestionario.service';
import { Respuesta } from 'src/app/model/respuesta';
import { PreguntaEnum } from 'src/app/utils/preguntaenum';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})
export class PreguntasComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog, private router: Router, private cuestionarioService: CuestionarioService) { }

  ngOnInit(): void {
    this.tipoRespuestas.set(0, 'Siempre');
    this.tipoRespuestas.set(1, 'Casi siempre');
    this.tipoRespuestas.set(2, 'Algunas veces');
    this.tipoRespuestas.set(3, 'Casi nunca');
    this.tipoRespuestas.set(4, 'Nunca');
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.cuestionario = params['cuestionario'];
      this.cuestionarioService.getPreguntas(this.cuestionario, this.getPreguntas, this.callFailure);
      this.cuestionarioService.getSacOrJefe(this.cuestionario,this.getSacOrJefe,this.callFailure);
    });
  }

  preguntaActual: number = 1;
  pregunta: Pregunta = new Pregunta();

  cuestionario: number;

  tipoRespuestas: Map<number, String> = new Map<number, String>();

  preguntas: Map<number, Pregunta> = new Map<number, Pregunta>();
  preguntasNormales: Map<number, Pregunta> = new Map<number, Pregunta>();
  preguntasSAC: Map<number, Pregunta> = new Map<number, Pregunta>();
  preguntasJefe: Map<number, Pregunta> = new Map<number, Pregunta>();

  showTable: boolean = true;
  errorMessage: string;

  showMensajeAgradecimiento: boolean = true;

  sac: PreguntaEnum = PreguntaEnum.NO_RESPONDIDO;
  jefe: PreguntaEnum = PreguntaEnum.NO_RESPONDIDO;
  skip: boolean = false;
  enviar: boolean = false;
  selectActivo: boolean = false;
  menuHide: boolean = true;

  showExitButton: boolean = false;

  public changeMenu(): void {
    this.menuHide = !this.menuHide;
  }

  private getSacOrJefe = (content: any): void => {
    this.sac = content.sac;
    this.jefe= content.jefe;
  }
  private getPreguntas = (content: any): void => {

    content.forEach((element: any) => {
      let pregunta: Pregunta = new Pregunta();
      pregunta.build(element);
      this.preguntas.set(pregunta.id, pregunta);
    });


    //llenar tablas
    this.preguntas.forEach((pregunta: Pregunta) => {

      if (pregunta.servicioAlCliente) {
        this.preguntasSAC.set(pregunta.id, pregunta);
      } else if (pregunta.jefe) {
        this.preguntasJefe.set(pregunta.id, pregunta);
      } else {
        this.preguntasNormales.set(pregunta.id, pregunta);
      }
    });

    this.pregunta = this.preguntas.get(1) as Pregunta;
    this.showTable = true;

    this.cuestionarioService.getRespuestas(this.cuestionario, this.setRespuestas, this.callFailure);
  }

  private setRespuestas = (content: any) => {


    this.checkData(content);

  }
  async checkData(content: any) {
    await content.forEach((respuestaJson: any) => {

      let pregunta: Pregunta = this.preguntas.get(respuestaJson.idPregunta) as Pregunta;
      pregunta.respondida = true;
      pregunta.respuesta = respuestaJson.idTipoPregunta;
      if (pregunta.jefe) {
        this.jefe = PreguntaEnum.VALIDO;
      }
      if (pregunta.servicioAlCliente) {
        this.sac = PreguntaEnum.VALIDO;
      }

    });



    this.selectActivo = true;

    if (this.validarPreguntas()) {
      this.showExitButton = true;
      this.showMensajeAgradecimiento = false;
    }
  }

  public changePregunta(idPregunta: number) {
    this.skip = false;
    this.preguntaActual = idPregunta;
    this.pregunta = this.preguntas.get(idPregunta) as Pregunta;
    this.skipPregunta();
  }

  public createAnswer() {

    console.log("" + this.pregunta.respuesta)

    this.pregunta.respondida = true;

    if (this.validarPreguntas()) {
      this.showExitButton = true;
      if (this.showMensajeAgradecimiento) {
        alert("Usted ha respondido todas las preguntas, gracias por su participación.");
        this.cuestionarioService.updateCompletarCuestionario(this.cuestionario,()=>{},this.callFailure);
        this.showMensajeAgradecimiento = false;
      }
    }

    let respuesta: Respuesta = new Respuesta();
    respuesta.idCuestionario = this.cuestionario;
    respuesta.idPregunta = this.pregunta.id;
    respuesta.idTipoPregunta = this.pregunta.respuesta;

    this.cuestionarioService.insertRespuesta(respuesta, (content: any) => { this.siguientePregunta(); }, this.callFailureShowMessage);


  }


  public getColor(pregunta: Pregunta): string {
    if (this.pregunta.id === pregunta.id) { return 'color-azul'; }
    if(pregunta.servicioAlCliente && this.sac == PreguntaEnum.INVALIDO ){return 'color-verde';}
    if(pregunta.jefe && this.jefe == PreguntaEnum.INVALIDO){return 'color-verde';}
    return pregunta.respondida ? 'color-verde' : 'color-amarillo';
  }

  private validarPreguntas(): boolean {

    console.log(this.preguntas);

    for (let pregunta of this.preguntasNormales.values()) {
      if (!pregunta.respondida) {
        return false;
      }
    }

    if (this.jefe === PreguntaEnum.NO_RESPONDIDO || this.sac === PreguntaEnum.NO_RESPONDIDO) { return false; }

    if (this.sac === PreguntaEnum.VALIDO) {
      for (let pregunta of this.preguntasSAC.values()) {
        if (!pregunta.respondida) {
          return false;
        }
      }
    }
    if (this.jefe === PreguntaEnum.VALIDO) {
      for (let pregunta of this.preguntasJefe.values()) {
        if (!pregunta.respondida) {
          return false;
        }
      }
    }
    return true;
  }

  public siguientePregunta() {
    this.skip = false;


    if (this.preguntaActual < this.preguntas.size) {
      this.preguntaActual = this.preguntaActual + 1;
    }

    this.pregunta = this.preguntas.get(this.preguntaActual) as Pregunta;

    this.skipPregunta();
  }

  public salir() {
    this.router.navigate([""]);

  }

  public anteriorPregunta() {
    this.skip = false;

    if (this.preguntaActual > 1) {
      this.preguntaActual = this.preguntaActual - 1;
    }
    this.pregunta = this.preguntas.get(this.preguntaActual) as Pregunta;

    this.skipPregunta();
  }

  private skipPregunta() {
    if (this.pregunta.servicioAlCliente) {

      if (this.sac === PreguntaEnum.NO_RESPONDIDO) {

        // let's call our modal window
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "400px",
          data: {
            title: "¿En su trabajo debe brindar servicio a clientes o usuarios?"
          }
        });

        // listen to response
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.sac = PreguntaEnum.VALIDO;
            this.cuestionarioService.updateSacJefe({idCuestionario:this.cuestionario,typeSacOrJefe:0,valueSacOrJefe:1},()=>{},this.callFailure);

          } else {
            this.sac = PreguntaEnum.INVALIDO;
            this.skip = true;
            this.cuestionarioService.updateSacJefe({idCuestionario:this.cuestionario,typeSacOrJefe:0,valueSacOrJefe:2},()=>{},this.callFailure);

            if (this.validarPreguntas()) {
              this.showExitButton = true;
              if (this.showMensajeAgradecimiento) {
                alert("Usted ha respondido todas las preguntas, gracias por su participación.");
                this.cuestionarioService.updateCompletarCuestionario(this.cuestionario,()=>{},this.callFailure);
                this.showMensajeAgradecimiento = false;
              }
            }
        
          }
        });



      } else if (this.sac === PreguntaEnum.INVALIDO) {
        this.skip = true;
      }
    }

    if (this.pregunta.jefe) {

      if (this.jefe === PreguntaEnum.NO_RESPONDIDO) {
        // let's call our modal window
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "400px",
          data: {
            title: "¿Es usted jefe de otros trabajadores?"
          }
        });

        // listen to response
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.jefe = PreguntaEnum.VALIDO;
            this.cuestionarioService.updateSacJefe({idCuestionario:this.cuestionario,typeSacOrJefe:1,valueSacOrJefe:1},()=>{},this.callFailure);
          } else {
            this.jefe = PreguntaEnum.INVALIDO;
            this.skip = true;
            this.cuestionarioService.updateSacJefe({idCuestionario:this.cuestionario,typeSacOrJefe:1,valueSacOrJefe:2},()=>{},this.callFailure);

            if (this.validarPreguntas()) {
              this.showExitButton = true;
              if (this.showMensajeAgradecimiento) {
                alert("Usted ha respondido todas las preguntas, gracias por su participación.");
                this.cuestionarioService.updateCompletarCuestionario(this.cuestionario,()=>{},this.callFailure);
                this.showMensajeAgradecimiento = false;
              }
            }
        


          }
        });

      } else if (this.jefe === PreguntaEnum.INVALIDO) {
        this.skip = true;
      }

    }
  }



  private callFailure = (content: any, error: Errors): void => { this.showTable = false; this.errorMessage = error; }
  private callFailureShowMessage = (content: any, error: Errors): void => { alert(error); }



  /**
   * public test(){
     this.preguntas.forEach((pregunta:Pregunta)=>{
       pregunta.respondida = true;
       pregunta.respuesta = 1;
     
     });
     this.jefe = PreguntaEnum.VALIDO;
     this.sac = PreguntaEnum.VALIDO;
     console.log(this.validarPreguntas());
   }
   * 
   * 
   */


}
