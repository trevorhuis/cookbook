class RecipesController < ApplicationController
  allow_unauthenticated_access only: %i[ index show ]
  before_action :set_recipe, only: %i[ show edit update destroy ]

  def index
    @recipes = Recipe.page(params[:page]).per(8)
  end

  def show
  end

  def new
    @recipe = Recipe.new
  end

  def create
    @recipe = Recipe.new(recipe_params)
    if @recipe.save
      redirect_to @recipe
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @recipe.update(recipe_params)
      redirect_to @recipe
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @recipe.destroy
    redirect_to recipes_path
  end

  private
    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    def recipe_params
      params.expect(recipe: [:name, :content, :featured_image])
    end
end
