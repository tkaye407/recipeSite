const recipes_options = {
    limit: 50,
    projection: {
        image: 1,
        title: 1,
        tags: 1,
    }
}

function getRecipes() {
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    console.log(tagParam)

    var filterDoc = {}
    if (tagParam) {
        filterDoc["tags"] = tagParam
    }
    console.log(filterDoc)

    var recipesList = document.getElementById("recipesList")
    loginAnon(function(recipesColl, isAdmin) {
        const recipes = recipesColl.find(filterDoc, recipes_options).asArray().then(recipes => {
            for (recipe of recipes) {

                /*
                	<div class="col-lg-4 col-md-6 col-sm-12 wow fadeIn">
                	  <div class="recipe-item text-center">
                	    <a href="recipe.html">
                	      <img src="images/bbq-pork-ribs.jpg" alt="bbq-pork-ribs" />
                	    </a>
                	    <br />
                	    <h3>Barbecue Pork Ribs</h3>
                	  </div>
                	</div>
                */

                console.log(recipe._id)
                var newDiv = document.createElement("DIV")
                newDiv.setAttribute('class', 'col-lg-4 col-md-6 col-sm-12 wow fadeIn');
                recipesList.appendChild(newDiv)

                var newRecipeDiv = document.createElement("DIV")
                newRecipeDiv.setAttribute('class', 'recipe-item text-center');
                newDiv.appendChild(newRecipeDiv)

                var newRecipeContainerLink = document.createElement("A")
                newRecipeContainerLink.setAttribute('href', `recipe.html?id=${recipe._id.toHexString()}`);

                var newRecipeImage = document.createElement("IMG")
                if (recipe.image != null && recipe.image != undefined) {
                    newRecipeImage.setAttribute('src', recipe.image);
                    newRecipeImage.setAttribute('alt', 'Image not found');
                	newRecipeImage.setAttribute('onerror', 'this.src="images/bbq-pork-ribs.jpg"');
                } else {
                    newRecipeImage.setAttribute('src', 'images/bbq-pork-ribs.jpg');
                    newRecipeImage.setAttribute('alt', 'images/bbq-pork-ribs');
                }
                newRecipeContainerLink.appendChild(newRecipeImage)

                var lineBreak = document.createElement("BR");

                var recipeTitle = document.createElement("H3");
                recipeTitle.textContent = recipe.title

                newRecipeDiv.appendChild(newRecipeContainerLink)
                newRecipeDiv.appendChild(lineBreak)
                newRecipeDiv.appendChild(recipeTitle)
            }

            if (isAdmin) {
                var addRecipeButton = document.createElement("BUTTON")
                addRecipeButton.setAttribute("class", "btn form-control")
                addRecipeButton.setAttribute("onclick", "window.location.href='./insert.html'")
                addRecipeButton.textContent = "Add New Recipe"

                var addRecipeDiv = document.getElementById("addNewItemDiv")
                addRecipeDiv.appendChild(addRecipeButton)
            }

        }).catch(err => {
            console.log("Error getting recipes: ", err)
        })
    })
}