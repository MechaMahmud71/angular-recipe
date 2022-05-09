import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy{

  @ViewChild('f', { static: true }) slForm: NgForm;

  public subscription: Subscription;

  public ingredientIndex:number;

  public ingredient: Ingredient;

  public isEditMode: boolean=false;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.getIngredientIndex.subscribe(index => {
      this.ingredientIndex = index;
      this.isEditMode = true;
      this.ingredient = this.slService.fetchIngredientByIndex(this.ingredientIndex);
      this.slForm.setValue({
        name: this.ingredient.name,
        amount: this.ingredient.amount
      })
    });
  }

  onAddItem(form:NgForm) {

    const { value } = form;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.isEditMode) {
      this.slService.updateIngredient(this.ingredientIndex,newIngredient);
    }
    else {
      this.slService.addIngredient(newIngredient);
    }
    this.isEditMode = false;

    this.slForm.reset();

  }

  clearForm() {
    this.isEditMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.ingredientIndex);
    this.isEditMode = false;
    this.slForm.reset()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
