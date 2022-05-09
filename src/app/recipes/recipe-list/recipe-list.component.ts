import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage-service.service';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy{
  public recipes: Recipe[];
  public subscription: Subscription;

  constructor(private recipeService: RecipeService,private router:Router,private route:ActivatedRoute,private dataStorageService:DataStorageService) {
  }

  ngOnInit() {

    this.recipes = this.recipeService.getRecipes();
    this.subscription=this.recipeService.recipeEmitter.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    })
    console.log(this.recipes);
  }

  onNavigateToNew() {
    this.router.navigate(['new'],{relativeTo:this.route})
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}












