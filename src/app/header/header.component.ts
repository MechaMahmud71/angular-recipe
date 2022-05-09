import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { DataStorageService } from '../shared/data-storage-service.service';

@Component({
  styleUrls:['./header.component.css'],
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  public recipes: Recipe[] = [];
  public subscription: Subscription;
  public isAuthenticated: boolean;
  public token:string;
  constructor(private recipeService:RecipeService,private dataStorageService:DataStorageService,private router:Router,private authService:AuthService) { }

  ngOnInit() {

    this.subscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(user._token)
      // console.log(user)
      if (!!user) {
        this.authService.setToken(user?._token);
      }
    })
  }

  onSave() {
    this.recipes = this.recipeService.getRecipes();
    this.dataStorageService.storeRecipes(this.recipes).subscribe(recipes => {
      this.recipes = recipes;
      // console.log(this.recipes)
    })
  }

  onFetchRecipe() {
    this.dataStorageService.fetchRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.recipeService.setRecipes(recipes);
      console.log(recipes);
    })
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth'])
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
