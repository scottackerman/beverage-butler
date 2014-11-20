<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>
        <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0" />

        <link rel="stylesheet" type="text/css" href="/Stylesheets/reset.css" />
        <link rel="stylesheet" type="text/css" href="/Stylesheets/Site.css" />
        <link rel="stylesheet" type="text/css" href="/Stylesheets/app/menu.css" />
		<link rel="stylesheet" type="text/css" href="/Stylesheets/Admin.css" />
    </head>
    <body>
        <div id="page_overlay"></div>
        <div id="main_container">
			<a class="ingredientsEditor" href="edit_ingredients">Edit ingredients List</a>
			<a class="homeButton" href="/">Beverage Butler</a>
            <div id="body" class="admin">
                <section class="content-wrapper main-content clear-fix">
					<a class="machineSettingsEditor" href="machineSettings">Machine Settings</a>
                    <div id="initial_response_container">
                        <div id="modal_header">
                            <div class="active_header">Ingredients List</div>
                        </div>
                        <ul id="modal_copy">
                            <li class="active">Ingredient 1: <input class="ingredient" type="text" name="ingredient1"></li>
							<li class="active">Ingredient 2: <input class="ingredient" type="text" name="ingredient2"></li>
							<li class="active">Ingredient 3: <input class="ingredient" type="text" name="ingredient3"></li>
							<li class="active">Ingredient 4: <input class="ingredient" type="text" name="ingredient4"></li>
                        </ul>
                        <div id="modal_responses">
                            <a href="response_save" class="button" id="response_save">Save</a>
                            <a href="response_cancel" class="button" id="response_cancel">Cancel</a>
                        </div>
                    </div>
                    <div id="menu_container">
                        <div><img src="/Images/hexagon.png" id="hexagon" /></div>
                        <div><img src="/Images/admin.menu.container.png" id="menu_background" /></div>
                        <ul id="menu_drinks">
                            <?php $counter = 1; ?>
                            <?php foreach($recipes->list as $recipe): ?>
                                <li class="drink_holder">
                                    <?php if($recipe->canBeServed == true) : ?>
                                        <a href="<?php echo 'drink-' . $counter ?>" drink-data-id="<?php echo $recipe->id; ?>"><span class="drink-title"><?php echo $recipe->name ?></span>
                                            <ul>
                                                <li class="ingredients_text"><?php echo $recipe->ingredientsString; ?></li>
                                            </ul>
                                        </a>                                 
                                    <?php else : ?>
                                        <a href="<?php echo 'drink-' . $counter ?>" drink-data-id="<?php echo $recipe->id; ?>" class="disable_drink"><span class="drink-title"><?php echo $recipe->name ?></span></a>
                                    <?php endif; ?>
                                </li>  
                                <?php $counter++; ?>
                            <?php endforeach; ?>
                        </ul>
                        <div class="admin_footer">
                            <p>Select a drink to edit it.</p>
                        </div>
                    </div>
					<form class="recipesForm" name="recipesList">
						<ul class="recipeIngredients">
							<li><p class="recipeName">Recipe 1 Name:</p><input class="recipe" type="text" name="recipe1">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 2 Name:</p><input class="recipe" type="text" name="recipe2">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 3 Name:</p><input class="recipe" type="text" name="recipe3">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 4 Name:</p><input class="recipe" type="text" name="recipe4">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 5 Name:</p><input class="recipe" type="text" name="recipe5">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 6 Name:</p><input class="recipe" type="text" name="recipe6">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 7 Name:</p><input class="recipe" type="text" name="recipe7">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 8 Name:</p><input class="recipe" type="text" name="recipe8">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 9 Name:</p><input class="recipe" type="text" name="recipe9">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
							<li><p class="recipeName">Recipe 10 Name:</p><input class="recipe" type="text" name="recipe10">
								<a class="addIngredient" href="#">Add Ingredient</a>
								<ul class="ingredientHolder">
								</ul>
							</li>
						</ul>
						<input class="cancel" type="button" value="Cancel">
						<input type="submit" value="Submit">
					</form>
                </section>
            </div>
        </div>

		<div>
			<form class="preferencesForm" name="preferencesForm">
				<h2>Machine Configuration</h2>

					<div class="prefDiv">
						<span class="preferenceP">Unit of Measurment:</span>
						<input class="unitOfMeasurement" type="radio" name="unitOfMeasurement" value="oz">oz<input class="unitOfMeasurement" type="radio" name="unitOfMeasurement" value="ml">ml
					</div>
					<div class="prefDiv">
						<p class="preferenceName">Measurement Increment:</p>
						<input class="preference measurementIncrement" type="text" name="measurementIncrement">
					</div>
					<div class="prefDiv">
						<p class="preferenceName">Minimum Measurement Per Ingredient:</p>
						<input class="preference minMeasurementPerIngredient" type="text" name="minMeasurementPerIngredient">
					</div>
					<div class="prefDiv">
						<p class="preferenceName">Maximum Measurement Per Ingredient:</p>
						<input class="preference maxMeasurementPerIngredient" type="text" name="maxMeasurementPerIngredient">
					</div>

				<input class="preferencesCancel" type="button" value="Cancel">
				<input class="preferencesSubmit" type="submit" value="Submit">
			</form>
		</div>
            
        <script src="/Scripts/lib/LAB.js"></script>
        <script>
            $LAB
                .script('/Scripts/modernizr-2.5.3.js').wait()
                .script('/Scripts/jquery-1.8.2.js').wait()

                .script('/Scripts/lib/jquery.percentageloader-0.1.js').wait()
                .script('/Scripts/jquery.easing.1.3.js').wait()

                .script('/Scripts/app/admin_menu.js').wait(function () {
                    App.Global.init();
                });
        </script>
    </body>
</html>




