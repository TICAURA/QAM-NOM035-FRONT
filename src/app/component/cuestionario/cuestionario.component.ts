import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Errors } from 'src/app/utils/errors';
import { Cuestionario } from 'src/app/model/cuestionario';
import { CuestionarioService } from 'src/app/service/cuestionario.service';
import { HttpSenderService } from 'src/app/service/http-sender.service';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute,private router:Router, private cuestionarioService:CuestionarioService, private httpSenderService:HttpSenderService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params:any) => {
      console.log(params);
     
      if(this.httpSenderService.getToken()===null){
        this.token = params['token'];
        if(this.token===null || this.token === undefined){this.showTable=false; this.errorMessage="Usted no tiene acceso a esta información.";}
        this.httpSenderService.setToken(this.token);
      }
     
      this.cuestionarioService.getCuestionarios(this.getCatalogues,this.callFailure);
    });
  }

  token:string;
  cuestionarios:Array<Cuestionario> = new Array<Cuestionario>();
  showTable:boolean = true;
  errorMessage:string;

  private getCatalogues = (content:any) :void =>{

    content.forEach((element:any) => {
      let cuestionario:Cuestionario = new Cuestionario();
      cuestionario.build(element);
      this.cuestionarios.push(cuestionario);
    });

  }

  public mostrarPreguntas(id:number){
    this.router.navigate(["/preguntas"], { queryParams: { cuestionario: id } }); 
  }

  private callFailure = (content:any,error:Errors) :void =>{this.showTable=false; this.errorMessage=error;} 
  
   
}
