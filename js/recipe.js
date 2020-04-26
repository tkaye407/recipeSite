function getRecipe() {
    loginAnon(function() {
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get('id');

        var quantityMultiplier = Number(urlParams.get('mult') || 1)
        if (Number.isNaN(quantityMultiplier)) {
            quantityMultiplier = 1
        }

        var recipesList = document.getElementById("recipesList")
        const filterDoc = {
            _id: new stitch.BSON.ObjectId(idParam)
        };
        loginAnon(function(recipesColl, isAdmin) {
            recipesColl.findOne(filterDoc).then(recipe => {
                console.log(recipe)

                var recipeAuthor = document.getElementById("recipeAuthor")
                recipeAuthor.innerText = `${recipe.author}`

                var recipeTitleDiv = document.getElementById("recipeTitleDiv")
                var recipeTitle = document.createElement("H2")
                if (isAdmin) {
                    recipeTitle.innerText = `${recipe.title} (Click To Edit)`

                    var recipeEditLink = document.createElement("A")
                    recipeEditLink.setAttribute("href", `./insert.html?id=${idParam}`)

                    recipeEditLink.appendChild(recipeTitle)
                    recipeTitleDiv.appendChild(recipeEditLink)
                } else {
                    recipeTitle.innerText = `${recipe.title}`
                    recipeTitleDiv.appendChild(recipeTitle)
                }

                var recipeTime = document.getElementById("recipeTime")
                recipeTime.innerText = `${recipe.time} ${recipe.timeUnit}`

                var recipeServings = document.getElementById("recipeServings")
                recipeServings.innerText = `${quantityMultiplier * recipe.servings}`

                var recipeServingsMultiple = document.getElementById("servingsMultiple")
                recipeServingsMultiple.selectedIndex = quantityMultiplier - 1

                var recipeDifficulty = document.getElementById("recipeDifficulty")
                for (var i = 0; i < recipe.difficulty; i++) {
                    newElem = document.createElement("I")
                    newElem.setAttribute("class", "fa fa-star")
                    newElem.setAttribute("aria-hidden", "true")
                    recipeDifficulty.appendChild(newElem)
                }

                var recipeDate = document.getElementById("recipeDate")
                recipeDate.innerText = `${recipe.date.toLocaleString('default', { month: 'long', year: 'numeric'})}`

                var recipeTags = document.getElementById("recipeTags")
                if (Array.isArray(recipe.tags)) {
                    recipeTags.innerHTML = recipe.tags.join("</br>")
                }

                var recipeImage = document.getElementById("recipeImage")
                if (recipe.image) {
                    recipeImage.src = `${recipe.image}`
                } else {
                    recipeImage.src = "images/bbq-pork-ribs.jpg"
                }

                var recipeIngredientsList = document.getElementById("recipeIngredientsList")
                for (ingredient of recipe.ingredients) {

                    var newQuantity = document.createElement("DT")
                    newQuantity.innerText = `${ingredient.quantity * quantityMultiplier} ${ingredient.metric}`

                    var newIngredient = document.createElement("DD")
                    newIngredient.innerText = `${ingredient.name}`

                    recipeIngredientsList.appendChild(newQuantity)
                    recipeIngredientsList.appendChild(newIngredient)
                }

                var recipeDirectionsList = document.getElementById("recipeDirectionsList")
                var count = 1
                for (instructions of recipe.instructions) {
                    count = count + 1

                    var newInstruction = document.createElement("LI")
                    newInstruction.innerText = `${instructions}`

                    recipeDirectionsList.appendChild(newInstruction)
                }
            }).catch(err => {
                console.log("Error getting recipes: ", err)
            })
        })
    })
}

function onServingsSelect() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    var servingsMultiple = document.getElementById("servingsMultiple")

    window.location.href = `./recipe.html?id=${idParam}&mult=${servingsMultiple.value}`
}
