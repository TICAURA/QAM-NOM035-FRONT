import { Injectable } from '@angular/core';
import { HttpSenderService } from './http-sender.service';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

  constructor(private  httpSenderService:HttpSenderService) { 

  }
  getCuestionarios(successCallback:any,errorCallback:any){
    const endpoint:string = "";
    const method:string = 'GET';
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,undefined);
  }

  getPreguntas(cuestionarioId:number,successCallback:any,errorCallback:any){
    const endpoint:string = `/preguntas/${cuestionarioId}`;
    const method:string = 'GET';
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,undefined);
  }
  getRespuestas(cuestionarioId:number,successCallback:any,errorCallback:any){
    const endpoint:string = `/respuestas/${cuestionarioId}`;
    const method:string = 'GET';
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,undefined);
  }

  insertRespuestas(body:any,successCallback:any,errorCallback:any){
    
    const endpoint:string = "/respuestas";
    const method:string = 'POST';
    const jsonBody:string = JSON.stringify(body);
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,jsonBody);
  }
  insertRespuesta(body:any,successCallback:any,errorCallback:any){
    
    const endpoint:string = "/respuesta";
    const method:string = 'POST';
    const jsonBody:string = JSON.stringify(body);
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,jsonBody);
  }
  getSacOrJefe(cuestionarioId:number,successCallback:any,errorCallback:any){

    const endpoint:string = `/sac-jefe/${cuestionarioId}`;
    const method:string = 'GET';
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,undefined);

  }

  updateCompletarCuestionario(cuestionarioId:number,successCallback:any,errorCallback:any){

    const endpoint:string = `/completar/${cuestionarioId}`;
    const method:string = 'GET';
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,undefined);

  }


  updateSacJefe(body:any,successCallback:any,errorCallback:any){
    
    const endpoint:string = "/update-sac-jefe";
    const method:string = 'POST';
    const jsonBody:string = JSON.stringify(body);
    this.httpSenderService.makeHttpRequest(endpoint,method,successCallback,errorCallback,jsonBody);
  }



}
