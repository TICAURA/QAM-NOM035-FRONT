import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Errors } from '../utils/errors';

@Injectable({
  providedIn: 'root'
})
export class HttpSenderService {
  header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': '',
    'Access-Control-Allow-Origin': '*'
  }

  constructor() { 
    
    
    this.getToken();
  }

  public setToken(token:string):void{
    this.header.Authorization = token;
    
  }

  public getToken(){
    

    if(this.header.Authorization !== ""){
      return this.header.Authorization;
    }else{
      return null;
    }
  }

  public async makeHttpRequest(endpoint:string,method:string,successCallback:any,errorCallback:any,body?:string){

    
    if(this.header.Authorization === ''){ errorCallback("Porfavor haga login antes de acceder a la información.",Errors.LOGIN); return;}
   
    const rawResponse = await fetch(environment.qammUrl+endpoint,this.buildParameters(method,body));
  
    const content = await rawResponse.json();
    
   
      if(rawResponse.status>=200 && rawResponse.status<300 ){

        if(rawResponse.headers.get('New-token')!==undefined && rawResponse.headers.get('New-token') !== null ){
          this.setToken(rawResponse.headers.get('New-token') as string);
        }

        successCallback(content);
      }else{
        console.debug("Error :"+content.error);
        let error:Errors;

        switch(rawResponse.status){
          case 401:{ error=Errors.UNAUTHORIZED; break;}
          case 404:{ error=Errors.NOT_FOUND; break;}
          case 406:{ error=Errors.NOT_ACCEPTABLE;break;}
          case 500:{ error=Errors.INTERNAL_SERVER_ERROR; break;}
          default: { error=Errors.INTERNAL_SERVER_ERROR; break;}
        }

        errorCallback(content.error,error);
      }
  
  }

  private getCookie(name:string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    let cookie =  parts.pop();
    if (parts.length === 2 && cookie!=undefined) 
    return cookie.split(';').shift();
    else
    return undefined;
  }

  private setCookie(cname:string, cvalue:string, exminutes:number) {
    const d = new Date();
    d.setTime(d.getTime() + (exminutes*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  private buildParameters(method:string,body?:string){
    if(body!== undefined){ 
      const params =  {
        method: method,
        headers: this.header,
        body: body
        }
        return params;
    }else{
      const params =  {
        method: method,
        headers: this.header
        }
        return params;
    }
  }

}
