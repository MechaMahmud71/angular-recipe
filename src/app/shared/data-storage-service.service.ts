import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private URL = "https://angulartest-9f7c2-default-rtdb.firebaseio.com/";

  constructor(private http: HttpClient,private recipeService:RecipeService) { }

  storeRecipes(recipes:Recipe[]):Observable<Recipe[]> {
    return this.http.put<Recipe[]>(this.URL+"/recipes.json",recipes)
  }

  fetchRecipes():Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.URL + "/recipes.json").pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients:recipe.ingredients?recipe.ingredients:[]
          }
        })
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }


}
