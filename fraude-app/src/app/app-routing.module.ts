import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FraudeComponent } from './fraude/fraude.component'

const routes: Routes = [
  {path: "fraude", component: FraudeComponent},
  {path: "", component: FraudeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
