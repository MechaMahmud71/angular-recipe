import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public recipe: Recipe;
  public id: number;

  constructor(private recipeService: RecipeService,private slService:ShoppingListService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.recipe = this.recipeService.getSingleRecipe(id);
      // console.log(this.recipe)
    })
  }

  onNavigateToEdit() {
    // this.router.navigate(['/recipes',this.id,'edit'])
    this.router.navigate(['edit'],{relativeTo:this.route})
  }



  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipe.id);
    this.router.navigate(['recipes'])
  }




}
