import { initFormListeners, initRecipesListeners, userName } from '../../src/index.js';

export var lastPageLoaded = 'home';
var navCollection = document.getElementsByClassName("loginLogout");
export var loginNav = [];
export var loginStatus = false;

var recipes = [];
var initialIngredCount = 3;
var initialInstructCount = 3;

var modelUserName = userName;

for (let i = 0; i < navCollection.length; i++) {
    loginNav[i] = navCollection[i];
}
export function toggleMenu(btn)
{
    console.log("class toggle now v");
    btn.classList.toggle("open");
    console.log(btn);
}


export function changeRoute() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace('#', '');
    $("#app").off("click", "**");

    if (!$(".viewRecipe").hasClass("hide"))
    {
        $(".viewRecipe").toggleClass("hide");
    }

    setTimeout(() => {
        switch (pageID) {
            case '':
            case 'home':
                $.get(`pages/home.html`, function (data) {
                    $('#app').html(data);
                   })
                   .fail(function () {
                       alert("Error 404, page not found");
                      });
                lastPageLoaded = 'home';
                break;
            case 'signUp':
            case 'login':
                console.log("services: attempting now");
                authenticate.accountHandler(pageID);
                break;
            case 'loginPage':
                authenticate.accountHandler(pageID);
                $.get(`pages/loginPage.html`, function (data) {
                    $('#app').html(data);
                   })
                   .fail(function () {
                       alert("Error 404, page not found");
                      });
                break;
            case 'create':
                $.get(`pages/${pageID}.html`, function (data) {
                    $('#app').html(data);
                   })
                   .fail(function () {
                    alert("Error 404, page not found");
                   });
                lastPageLoaded = pageID;
                setTimeout(preparePage, 50);
                break;
            case 'recipes':
                $.get(`pages/${pageID}.html`, function (data) {
                    $('#app').html(data);
                   })
                   .fail(function () {
                    alert("Error 404, page not found");
                   });
                if (recipes.length != 0)
                {
                    setModal();
                    setTimeout(placeRecipes, 100);
                }
                setTimeout(function() {
                    $("#viewHeader").html(`Hey ${userName}, here are your recipes!`);
                }, 100);
                setTimeout(initRecipesListeners, 50);
                lastPageLoaded = pageID;
                break;
            case 'edit':
                $.get(`pages/${pageID}.html`, function (data) {
                    $('#app').html(data);
                   })
                   .fail(function () {
                    alert("Error 404, page not found");
                   });
                setTimeout(function() {
                    $("#editHeader").html(`Hey ${userName}, edit your recipe!`);
                }, 100);
                break;
            default:
                $.get(`pages/${pageID}.html`, function (data) {
                    $('#app').html(data);
                   })
                   .fail(function () {
                    alert("Error 404, page not found");
                   });
                lastPageLoaded = pageID;
                break;
        }
    }, 500);
    console.log("lastPage: " + lastPageLoaded);
}

function preparePage() {
    let createHeader = document.getElementById("createHeader");
    if (userName != null && userName != undefined)
    {
        createHeader.innerHTML = `Hey ${userName}, create your recipe today!`;
    }
    else
    {
        createHeader.innerHTML = "Hey Jungle Cook, create your recipe today!"
    }
    initFormListeners();
}

export function addRow(divSrc) {

    if (divSrc === ".formIngredients")
    {
        $(divSrc).append(`<input type="text" id="ingred${initialIngredCount}" placeholder="Ingredient #${++initialIngredCount}" />`)
    }
    else if (divSrc === ".formInstructions")
    {
        $(divSrc).append(`<input type="text" id="instruct${initialInstructCount}" placeholder="Instruction #${++initialInstructCount}" />`)
    }
}

export function addRecipe() {
    let newRecipe = {};

    let imagePath = $("#imagePath").val();
    let recipeName = $("#recipeName").val();
    let recipeDesc = $("#recipeDescription").val();
    let recipeTime = $("#totalTime").val();
    let recipeServings = $("#servingSize").val();

    newRecipe.imagePath = imagePath;
    newRecipe.recipeName = recipeName;
    newRecipe.recipeDesc = recipeDesc;
    newRecipe.recipeTime = recipeTime;
    newRecipe.recipeServings = recipeServings;

    newRecipe.ingredients = [];
    $(".formIngredients input").each(function (index, data) {
        var value = $(this).val();
        if (value != "")
        {
            let keyName = "ingredient" + index;
            let ingredObj = {};
            ingredObj[keyName] = value;

            newRecipe.ingredients.push(ingredObj);
        }
    });

    newRecipe.instructions = [];
    $(".formInstructions input").each(function (index, data) {
        var value = $(this).val();
        if (value != "")
        {
            let keyName = "instruction" + index;
            let instructObj = {};
            instructObj[keyName] = value;

            newRecipe.instructions.push(instructObj);
        }
    })

    if (newRecipe.recipeName != "")
    {
        console.log("newRecipe ", newRecipe);

        window.location.hash = "recipes";
        recipes.push(newRecipe);
        console.log(recipes);
    }
}

function setModal() {
    $(".recipeModal").toggleClass("hide");
}

function placeRecipes() {
    console.log("placing recipes: ", recipes);
    $(".cardHolder").html("");
    $("#noRecipes").remove();
    if (recipes.length != 0)
    {
        $.each(recipes, (index, recipe) => {
            $(".cardHolder").append(
                `<div class="recipeCard" data-index="${index}" >
                <div class="viewBtn recipesBtn">View</div>
                <div class="offCardBtns"><div class="editBtn recipesBtn">Edit Recipe</div><div class="deleteBtn recipesBtn">Delete</div></div>
                <div class="cardImage">
                    <img src="${recipe.imagePath}" alt="${recipe.recipeName}">
                </div>
                <div class="cardInfo">
                    <h3>${recipe.recipeName}</h3>
                    <p>${recipe.recipeDesc}</p>
                        <div class="cardDetails">
                            <img src="images/time.svg" alt="Time to Make">
                            <p>${recipe.recipeTime}</p>
                        </div>
                        <div class="cardDetails">
                            <img src="images/servings.svg" alt="Servings made">
                            <p>${recipe.recipeServings}</p>
                        </div>
                </div>
            </div>`
            )
            console.log("index:  " + index + " and recipes Length: " + recipes.length);
            if ((index == recipes.length - 1) || recipes.length == 0)
            {
                $(".cardHolder").append(`<div id="noRecipes">
                <div class="createButton">+</div>
                <h3>Click here to add more recipes!</h3>
            </div>`);
                initRecipesListeners();
                setTimeout(setModal, 100);
            }
        })  
    } 
    else
    {
        $(".cardHolder").append(`<div id="noRecipes">
        <div class="createButton">+</div>
        <h3>Click here to add more recipes!</h3>
    </div>`);
        initRecipesListeners();
        setTimeout(setModal, 100);
    }
}

export function viewRecipe(recipeIndex) {
    let selectedRecipe = recipes[recipeIndex];
    let ingredientsString = "";
    let instructionsString = "";

    $.each(selectedRecipe.ingredients, (index, ingredient) => {
        let keyName = "ingredient" + index;
        ingredientsString += `<li>${ingredient[keyName]}</li>`;
    });

    $.each(selectedRecipe.instructions, (index, instruction) => {
        let keyName = "instruction" + index;
        instructionsString += `<li>${instruction[keyName]}</li>`;
    });


    
    $(".viewRecipe").append(`<div class="mainView">
    <div class="mainImg"><img src="${selectedRecipe.imagePath}" alt="${selectedRecipe.recipeName}"><h3 class="recipeNameView">${selectedRecipe.recipeName}</h3></div>
    <div class="mainInfo">
      <h3>Description</h3>
      <p>${selectedRecipe.recipeDesc}</p>
      <h4>Total Time:</h4>
      <p>${selectedRecipe.recipeTime}</p>
      <h4>Servings:</h4>
      <p>${selectedRecipe.recipeServings}</p>
    </div>
  </div>
  <div class="listView ingredView">
    <h3>Ingredients:</h3>
    <ul>${ingredientsString}</ul>
    </div>
  <div class="listView instructView"><h3>Instructions:</h3>
  <ol>${instructionsString}</ol></div>
  <div class="editContainer">
    <div class="editButton recipesBtn">Edit Recipe</div>
  </div>`)
  $(".viewRecipe").toggleClass("hide");
}

export function editRecipe(recipeIndex) {
    let newRecipe = {};

    let imagePath = $("#imagePath").val();
    let recipeName = $("#recipeName").val();
    let recipeDesc = $("#recipeDescription").val();
    let recipeTime = $("#totalTime").val();
    let recipeServings = $("#servingSize").val();

    newRecipe.imagePath = imagePath;
    newRecipe.recipeName = recipeName;
    newRecipe.recipeDesc = recipeDesc;
    newRecipe.recipeTime = recipeTime;
    newRecipe.recipeServings = recipeServings;

    newRecipe.ingredients = [];
    $(".formIngredients input").each(function (index, data) {
        var value = $(this).val();
        if (value != "")
        {
            let keyName = "ingredient" + index;
            let ingredObj = {};
            ingredObj[keyName] = value;

            newRecipe.ingredients.push(ingredObj);
        }
    });

    newRecipe.instructions = [];
    $(".formInstructions input").each(function (index, data) {
        var value = $(this).val();
        if (value != "")
        {
            let keyName = "instruction" + index;
            let instructObj = {};
            instructObj[keyName] = value;

            newRecipe.instructions.push(instructObj);
        }
    })

    if (newRecipe.recipeName != "")
    {
        console.log("newRecipe ", newRecipe);

        window.location.hash = "recipes";
        recipes[recipeIndex] = newRecipe;
        console.log(recipes);
    }
}

export function deleteRecipe(recipeIndex) {
    recipes.splice(recipeIndex, 1);
    $(".deleteModal").toggleClass("hide");
    setModal();
    placeRecipes();
}

export function setEditPage(recipeIndex) {
    let editIngredCount = 3;
    let editInstructCount = 3;

    $("#imagePath").val(recipes[recipeIndex].imagePath);
    $("#recipeName").val(recipes[recipeIndex].recipeName);
    $("#recipeDescription").val(recipes[recipeIndex].recipeDesc);
    $("#totalTime").val(recipes[recipeIndex].recipeTime);
    $("#servingSize").val(recipes[recipeIndex].recipeServings);


    if (recipes[recipeIndex].ingredients.length > $(".formIngredients > input").length)
    {
        for (let i = 0; i < (recipes[recipeIndex].ingredients.length - $(".formIngredients > input").length); i++)
        {
            $(".formIngredients").append(`<input type="text" id="ingred${editIngredCount}" placeholder="Ingredient #${++editIngredCount}" />`);
        }
    }

    if (recipes[recipeIndex].instructions.length > $(".formInstructions > input").length)
    {
        for (let i = 0; i < (recipes[recipeIndex].instructions.length - $(".formInstructions > input").length); i++)
        {
            $(".formInstructions").append(`<input type="text" id="instruct${editInstructCount}" placeholder="Instruction #${++editInstructCount}" />`);
        }
    }

    $(".formIngredients input").each(function (index, data) {
        let keyName = "ingredient" + index;
        $(this).val(recipes[recipeIndex].ingredients[index][keyName]);
    });

    $(".formInstructions input").each(function (index, data) {
        let keyName = "instruction" + index;
        $(this).val(recipes[recipeIndex].instructions[index][keyName]);
    });
} 