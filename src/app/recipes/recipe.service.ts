import { EventEmitter, Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  // recipeSelected = new EventEmitter<Recipe>();

  recipeEmitter = new Subject<Recipe[]>();

  private recipes: Recipe[]=[];

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     1,
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //     ]),
  //   new Recipe(
  //     2,
  //     'Big Fat Burger',
  //     'What else you need to say?',
  //     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];

  constructor(private slService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeEmitter.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getSingleRecipe(id:number) {
    const recipe = this.recipes.find(el => el.id === id);
    return recipe;
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe:Recipe) {
    this.recipes.push(recipe);
    this.recipeEmitter.next(this.recipes.slice());
  }

  updateRecipe(newRecipe: Recipe, id: number) {
    newRecipe.id = id;
    for (let i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].id === id) {
        this.recipes[i] = {...newRecipe };
      }
    }
    // console.log(this.recipes)
    this.recipeEmitter.next(this.recipes.slice());
  }

  deleteRecipe(recipeId: number) {
    this.recipes = this.recipes.filter(el => el.id !== recipeId);
    console.log(this.recipes);
    this.recipeEmitter.next(this.recipes.slice())
  }
}
