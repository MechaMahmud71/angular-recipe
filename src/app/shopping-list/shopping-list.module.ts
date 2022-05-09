import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
// import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    // CommonModule,
    FormsModule,
    RouterModule.forChild([
      {   path: '', component: ShoppingListComponent }
    ]),
    SharedModule
  ]
})
export class ShoppingListModule { }
