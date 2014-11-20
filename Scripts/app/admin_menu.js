var App = App || {};

App.Global = (function (window, document) {
  // User Preferences
  // Initialize in case prefs JSON is corrupted or missing
  var UNIT_OF_MEASUREMENT = 'oz';
  var MEASUREMENT_INCREMENT = .5;
  var MIN_MEASUREMENT_PER_INGREDIENT = .5;
  var MAX_MEASUREMENT_PER_INGREDIENT = 8;

  // Application Config
  var INGREDIENT_ID_PREFIX = 'ingredient';
  var MACHINE_PREFERENCES_PATH = '/Data/preferences.json';
  var INGREDIENTS_PATH = '/Data/ingredients.json';
  var RECIPE_ID_PREFIX = 'recipe';
  var RECIPES_PATH = '/Data/recipes.json';
  var PIN_ARRAY = new Array(22, 17, 27, 18);
  var CREATE_DATA_PATH = '/Controllers/Services/JSONBuilder.php';

  var preferencesObject = [];
  var bottleOptionsObject = [];
  var recipesObject = [];
  var recipeIngredientHtml;
  var ingredientJson;
  var recipeJson;
  
	var $ingredientsEditButton = $('.ingredientsEditor'),
      $menuDrinks = $('#menu_drinks li a'),
      $hexagonBackground = $('#hexagon'),
			$pageOverlay = $('#page_overlay'),
			$initialResponseContainer = $('#initial_response_container'),
			$menuSave = $('#response_save'),
			$menuCancel = $('#response_cancel'),
			$activeResponseCopy = $('#modal_copy li.active');

	var menuButtonsLocationsOpen = [[364, -343], [227, -421], [77, -421], [-60, -343], [-135, -213], [-135, -49], [-60, 81], [77, 156], [227, 156], [364, 81]],
      menuButtonsLocationsClose = [[262, -196], [237, -196], [96, -191], [55, -160], [55, -165], [55, -88], [55, -88], [96, -88], [237, -88], [262, -74]];

	var menuCounter = 1,
      inactiveDrink,
      menuItemSelected = '',
      currentState = 'menu',
      currentFooterClassAttached = '';


	var self = {
		'init': function () {
		  $initialResponseContainer.hide();
		  $pageOverlay.hide();
		  self.hideRecipeElements();
			self.getMachinePreferences();
		},
		
		'getMachinePreferences': function () {
      $.get(MACHINE_PREFERENCES_PATH, function(prefs) {
        UNIT_OF_MEASUREMENT = prefs[0].unitOfMeasurement;
        MEASUREMENT_INCREMENT = parseFloat(prefs[0].measurementIncrement);
        MIN_MEASUREMENT_PER_INGREDIENT = parseFloat(prefs[0].minMeasurementPerIngredient);
        MAX_MEASUREMENT_PER_INGREDIENT = parseFloat(prefs[0].maxMeasurementPerIngredient);
        $('.unitOfMeasurement').val([UNIT_OF_MEASUREMENT]);
        $('.measurementIncrement').val(MEASUREMENT_INCREMENT);
        $('.minMeasurementPerIngredient').val(MIN_MEASUREMENT_PER_INGREDIENT);
        $('.maxMeasurementPerIngredient').val(MAX_MEASUREMENT_PER_INGREDIENT);
      }).done(function() {
        self.animateHexagon(530, 457, 120, 246, true);
  			self.getIngredientsAndRecipesFromData();
      }).fail(function() {
          $('.unitOfMeasurement').val([UNIT_OF_MEASUREMENT]);
          $('.measurementIncrement').val(MEASUREMENT_INCREMENT);
          $('.minMeasurementPerIngredient').val(MIN_MEASUREMENT_PER_INGREDIENT);
          $('.maxMeasurementPerIngredient').val(MAX_MEASUREMENT_PER_INGREDIENT);
          self.animateHexagon(530, 457, 120, 246, true);
    			self.getIngredientsAndRecipesFromData();
      });
		},
		
		'resetLocalData': function () {
		  preferencesObject = [];
      bottleOptionsObject = [];
      recipesObject = [];
    },
    
    'buildRecipeIngredientsHtml': function () {
      recipeIngredientHtml = '<li class="recipeIngredient"><div class="ingSlect">Ingredient: <select class="ingredientsList"><option value="" disabled selected>Select ingredient</option>';
      for(var i = 0; i < bottleOptionsObject.length; i++) {
        recipeIngredientHtml += '<option value="ingredient' + i + '">' + bottleOptionsObject[i] + '</option>';
      }
      recipeIngredientHtml += '</select></div><div class="amountSelect">Amount: <select class="measurmentList"><option value="0" disabled selected>0 ' + UNIT_OF_MEASUREMENT + '</option>';
      for(var j = MIN_MEASUREMENT_PER_INGREDIENT; j <= MAX_MEASUREMENT_PER_INGREDIENT; j += MEASUREMENT_INCREMENT) {
        recipeIngredientHtml += '<option value="' + j + '">' + j + ' ' + UNIT_OF_MEASUREMENT + '</option>';
      }
      recipeIngredientHtml += '</select></div><a class="removeIngredient" href="#">Remove Ingredient</a></li>';
    },
    
    'hideRecipeElements': function () {
      $('.recipesForm').hide();
      $('.recipeIngredients>li').each(function() {
        $(this).hide();
      });
    },
    
    'showMachinePreferences': function () {
      $pageOverlay.show();
      $('.preferencesForm').show();
    },
    
    'hideMachinePreferences': function () {
      $pageOverlay.hide();
      $('.preferencesForm').hide();
      $('input.preference').each(function(i) {
        $(this).parent().removeClass('emptyData');
      });
      self.getMachinePreferences();
    },
    
    'showRecipeElement': function (index) {
      $pageOverlay.show();
      $('.recipesForm').show();
      $('.recipeIngredients li:nth-child(' + index + ')').show();
    },
    
    'cancelRecipeEdit': function () {
      $pageOverlay.hide();
      self.hideRecipeElements();
      // Remove disabled class in case a max of new ingredients were added, but cancelled instead of saved
      $('.addIngredient').removeClass('disabled');
      self.buildRedipeElements();
    },
    
    'buildRedipeElements': function () {
      $('.recipesForm input[type=text]').each(function(i) {
        var elem = $(this);
        $(elem).val(recipeJson[i].name);
        // Remove all ingredients in case new ingredients were added, but cancelled instead of saved
        $(elem).parent().children('ul').children('li').each(function () {
          $(this).remove();
        });
        // Get ingredients and amounts for each recipe
        for (var j = 0; j < recipeJson[i].ingredients.length; j++) {
          var ingredientId = recipeJson[i].ingredients[j].id;
          var ingredientAmount = recipeJson[i].ingredients[j].amount;
          $(elem).parent().children('ul').append(recipeIngredientHtml);
          var thisElem = $(elem).parent().find('li:last-child');
          $(thisElem).find('.ingredientsList').val(ingredientId);
          $(thisElem).find('.measurmentList').val(ingredientAmount);
        }
        if(recipeJson[i].ingredients.length >= bottleOptionsObject.length) {
          $(elem).parent().find('.addIngredient').addClass('disabled');
        }
        // Add new listeners
        $(elem).parent().children('ul').find('.removeIngredient').click(function(evt) {
          evt.preventDefault();
          $(this).closest('.ingredientHolder').siblings('a').removeClass('disabled');
          $(this).closest('.recipeIngredient').remove();
        });
      });
    },
		
		'getIngredientsAndRecipesFromData': function () {
      self.resetLocalData();
      $.get(INGREDIENTS_PATH, function(ing) {
        ingredientJson = ing;
        $('#modal_copy input[type=text]').each(function(i) {
          $(this).val(ing[i].name);
          bottleOptionsObject.push(ing[i].name)
        });
        self.buildRecipeIngredientsHtml();
      }).done(function() {
        $.get(RECIPES_PATH, function(rec) {
          recipeJson = rec;
          // Remove disabled class in case a max of new ingredients were added, but cancelled instead of saved
          $('.addIngredient').removeClass('disabled');
          self.buildRedipeElements();
          self.initEventListeners();
        });
      });
    },
		
		'createJsonFile': function (fileName, jsonData) {
      var dataObject = {};
      dataObject[fileName] = jsonData;
      $.ajax({
          type: 'POST',
          url: CREATE_DATA_PATH,
          dataType: 'json', 
          data: {
            json: JSON.stringify(dataObject)
          },
          complete: function(){
            location.reload();
          }
      });
    },
    
    'checkPreferencesForErrors': function () {
      var empty = false;
      $('input.preference').each(function(i) {
        $(this).parent().removeClass('emptyData');
        if($(this).val() == '') {
          $(this).parent().addClass('emptyData');
          empty = true;
        }
      });
      if(empty == false) {
        self.buildPreferencesJson();
      }
    },
    
    'checkIngredientsForErrors': function () {
      var empty = false;
      $('.ingredient').each(function(i) {
        $(this).parent().removeClass('emptyData');
        if($(this).val() == '') {
          $(this).parent().addClass('emptyData');
          empty = true;
        }
      });
      if(empty == false) {
        self.buildBottlesJson();
      }
    },
    
    'preferencesSubmit': function () {
      self.hideMachinePreferences();
      console.log('sumbitted preferences.');
    },
    
    'buildPreferencesJson': function () {
      self.resetLocalData();
      var preferences = {};
      preferences.unitOfMeasurement = $('input:radio[name=unitOfMeasurement]:checked').val();
      preferences.measurementIncrement = $('.measurementIncrement').val();
      preferences.minMeasurementPerIngredient = $('.minMeasurementPerIngredient').val();
      preferences.maxMeasurementPerIngredient = $('.maxMeasurementPerIngredient').val();
      preferencesObject.push(preferences);
      self.createJsonFile('preferences', preferencesObject);
    },
		
		'buildBottlesJson': function () {
      self.resetLocalData();
      $('.ingredient').each(function(i) {
        var bottle = {};
        bottle.name = $(this).val();
        bottle.id = INGREDIENT_ID_PREFIX + i;
        bottle.pin = PIN_ARRAY[i];
        bottleOptionsObject.push(bottle);
      });
      self.createJsonFile('ingredients', bottleOptionsObject);
    },
    
    'addIngredientToRecipe': function (ingredient, recipe) {
      var liLength = $(ingredient).children();
      if (liLength.size() < bottleOptionsObject.length){
        $(ingredient).append(recipeIngredientHtml);
      }
      liLength = $(ingredient).children();
      if (liLength.size() >= bottleOptionsObject.length) {
        $(recipe).addClass('disabled');
      }
      // Set new listeners
      $(ingredient).find('.removeIngredient').click(function(evt) {
        evt.preventDefault();
        $(this).closest('.ingredientHolder').siblings('a').removeClass('disabled');
        $(this).closest('.recipeIngredient').remove();
      });
    },
    
    'checkRecipesForErrors': function () {
      var empty = false;
      $('.recipe').each(function(i) {
        $(this).parent().children('ul').children('li').each(function () {
          $('select', $(this)).each(function () {
            $(this).parent().removeClass('emptyData');
            if ($(this).is('.ingredientsList')) {
              if($(this).val() == ''){
                $(this).parent().addClass('emptyData');
                empty = true;
              }
            }
            if ($(this).is('.measurmentList')) {
              if(parseFloat($(this).val()) == 0){
                $(this).parent().addClass('emptyData');
                empty = true;
              }
            }
          });
        });
      });
      if(empty == false) {
        self.buildRecipesJson();
      }
    },
    
    'buildRecipesJson': function () {
      self.resetLocalData();
      // Clear out empty ingredients
      $('.recipe').each(function(i) {
        var recipe = {};
        recipe.name = $(this).val();
        recipe.id = RECIPE_ID_PREFIX + i;
        var ingredientsObject = [];
        $(this).parent().children('ul').children('li').each(function () {
          var ingredient = {};
          var empty = false;
          $('select', $(this)).each(function () {
            if ($(this).is('.ingredientsList')) {
              ingredient.id = $(this).val();
              if(ingredient.id == ''){
                empty = true;
              }
            }
            if ($(this).is('.measurmentList')) {
              ingredient.amount = parseFloat($(this).val());
              if(ingredient.amount == NaN){
                empty = true;
              }
            }
          });
          // Don't include empty or invalid ingredients
          if(empty == false) {
            ingredientsObject.push(ingredient);
          }
        });
        recipe.ingredients = ingredientsObject;
        recipesObject.push(recipe);
      });
      self.createJsonFile('recipes', recipesObject);
    },

		'initEventListeners': function () {
		  $ingredientsEditButton.on('click', function (e) {
		    e.preventDefault();
		    self.displayInitialComponents();
	    });
	    
			$menuSave.on('click', function (e) {
				e.preventDefault();
				self.checkIngredientsForErrors();
			});

			$menuCancel.on('click', function (e) {
				e.preventDefault();
				self.hideInitialComponents();
			});
			
			$('.machineSettingsEditor').click(function(evt) {
        evt.preventDefault();
        self.showMachinePreferences();
      });
			
      $('.preferencesSubmit').on('click', function (e) {
				e.preventDefault();
				self.checkPreferencesForErrors();
			});
      
      $('.preferencesCancel').on('click', function (e) {
				e.preventDefault();
				self.hideMachinePreferences();
			});
			
      $('.addIngredient').click(function(evt) {
        evt.preventDefault();
        self.addIngredientToRecipe($(this).parent().children('.ingredientHolder'), $(this));
      });
      
      $('.recipesForm .cancel').on('click', function (evt) {
        evt.preventDefault();
        self.resetMenu();
        self.cancelRecipeEdit();
      });

      $('.recipesForm').on('submit', function (evt) {
        evt.preventDefault();
        self.checkRecipesForErrors();
      });
      
      $('.removeIngredient').click(function(evt) {
        evt.preventDefault();
        $(this).closest('.ingredientHolder').siblings('a').removeClass('disabled');
        $(this).closest('.recipeIngredient').remove();
      });
		},

		'hideInitialComponents': function () {
			$pageOverlay.hide();
			$initialResponseContainer.hide();
      self.animateHexagon(530, 457, 120, 246, true);
		},

		'displayInitialComponents': function () {
			$pageOverlay.show();
			$pageOverlay.animate({
				opacity: 0.5
			}, 0, 'linear');

			$initialResponseContainer.show();
			$initialResponseContainer.animate({
				opacity: 1
			}, 300, 'linear');

			$activeResponseCopy.show();
			$menuSave.show();
			$menuCancel.show();
		},

		'animateHexagon': function (hWidth, hHeight, hMarTop, hMarLeft, continueProcess) {
			$hexagonBackground.animate({
				height: hHeight + 'px',
				marginLeft: hMarLeft + 'px',
				marginTop: hMarTop + 'px',
				width: hWidth + 'px'
			}, 1000, 'easeOutBack', function () {
				if (continueProcess) {
					self.animateMenuButtons('open');
				}
			});
		},

		'animateMenuButtons': function (direction) {
			var liLength = $('#menu_drinks li.drink_holder').length;
			if (menuCounter <= liLength) {
				var buttonMarginTop,
                    buttonMarginLeft,
                    buttonZIndex;

				if (direction == 'open') {
					buttonMarginTop = menuButtonsLocationsOpen[menuCounter - 1][0];
					buttonMarginLeft = menuButtonsLocationsOpen[menuCounter - 1][1];
					buttonZIndex = 9999;
				} else {
					buttonMarginTop = menuButtonsLocationsClose[menuCounter - 1][0];
					buttonMarginLeft = menuButtonsLocationsClose[menuCounter - 1][1];
					$('#menu_drinks li:nth-child(' + menuCounter + ') a').css({ 'z-index': '1' });
					buttonZIndex = 1;
				}

				$('#menu_drinks li:nth-child(' + menuCounter + ') a').animate({
					marginTop: buttonMarginTop + 'px',
					marginLeft: buttonMarginLeft + 'px',
					zIndex: buttonZIndex
				}, 300, 'easeOutBack', function () {
					if (direction == 'open') {
						$('#menu_drinks li:nth-child(' + menuCounter + ') a .drink-title').show();
					} else {
						$('#menu_drinks li:nth-child(' + menuCounter + ') a .drink-title').hide();
					}

					menuCounter++;
					self.animateMenuButtons(direction);
				});
			} else {
				menuCounter = 1;
				self.animateHexagon(400, 345, 172, 307, false);
			}

			self.initDrinksEvents();
		},

		'initDrinksEvents': function () {
			$menuDrinks.on('click', function (e) {
				e.preventDefault();
				var drinkSelected = $(this).attr('href').split('-'),
            liLength = $('#menu_drinks li.drink_holder').length;
				menuItemSelected = $(this).attr('drink-data-id');
				self.showRecipeElement(drinkSelected[1]);
				if (menuItemSelected != '') {
					for (var i = 0; i <= liLength; i++) {
						if (i != Number(drinkSelected[1])) {
							$('#menu_drinks li:nth-child(' + i + ') a').removeClass('active_drink'); //.addClass('over_bbackground');
						} else {
							$('#menu_drinks li:nth-child(' + i + ') a').addClass('active_drink');
						}
					}
				}
			});
		},

		'resetMenu': function () {
			var liLength = $('#menu_drinks li').length;
			menuItemSelected = '';
			for (var i = 1; i <= liLength; i++) {
				$('#menu_drinks li:nth-child(' + i + ') a').removeClass('over_bbackground').removeClass('out_bbackground').removeClass('active_drink');
			}
		}
	}

	return self;
})(this, this.document);