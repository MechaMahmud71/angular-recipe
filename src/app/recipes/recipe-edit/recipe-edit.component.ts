import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit,OnDestroy {

  public id: number;
  public isEdit: boolean=false;
  public subscription: Subscription;
  public recipeForm: FormGroup;
  public recipe: Recipe;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService,private router:Router) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.isEdit = params['id'] != null;
      if (this.isEdit) {
        this.recipe = this.recipeService.getSingleRecipe(this.id);
      }
      this.initForm();
    })
  }

  private initForm() {
    let recipeIngredients = new FormArray([]);

    if (this.isEdit) {
      this.recipeForm = new FormGroup({
        'name': new FormControl(this.recipe.name,Validators.required),
        'imagePath': new FormControl(this.recipe.imagePath,Validators.required),
        'description': new FormControl(this.recipe.description,Validators.required),
        'ingredients':recipeIngredients
      })
      if (this.recipe['ingredients']) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
            'name': new FormControl(ingredient.name,Validators.required),
            'amount': new FormControl(ingredient.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
          })
          )
        }
      }
    } else {
      this.recipeForm = new FormGroup({
        'name': new FormControl(null,Validators.required),
        'imagePath': new FormControl(null,Validators.required),
        'description': new FormControl(null,Validators.required),
        'ingredients': recipeIngredients
      })
    }

  }

  onSubmit() {

    const recipe: Recipe = { ...this.recipeForm.value };

    if (this.isEdit) {
      this.recipeService.updateRecipe(recipe,this.id)
    } else {
      recipe.id = this.recipeService.getRecipes().length + 1;
      this.recipeService.addRecipe(recipe);
    }

    this.router.navigate(['recipes',recipe.id])


  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null,Validators.required),
        'amount':new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['recipes',this.recipe.id])
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
