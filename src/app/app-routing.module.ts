import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuestionarioComponent } from './component/cuestionario/cuestionario.component';
import { PreguntasComponent } from './component/preguntas/preguntas.component';


const routes: Routes = [
  { path: '', component:CuestionarioComponent},
  { path: 'preguntas', component:PreguntasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
