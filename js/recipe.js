function getRecipe() {
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
    var apigClient = apigClientFactory.newClient();
    console.log("HI THERE 2")
    console.log(idParam)
    apigClient.recipesRecipeIdGet({
        recipe_id: idParam
    }, {}).then(result => {
        console.log("AWS RESULT")
        console.log(result)
        var recipe = result.data;

        var recipeAuthor = document.getElementById("recipeAuthor")
        recipeAuthor.innerText = `${recipe.author}`

        var recipeTitleDiv = document.getElementById("recipeTitleDiv")
        var recipeTitle = document.createElement("H2")

        recipeTitle.innerText = `${recipe.title}`

        var recipeEditLink = document.createElement("A")
        recipeEditLink.setAttribute("href", `./insert.html?id=${idParam}`)

        recipeEditLink.appendChild(recipeTitle)
        recipeTitleDiv.appendChild(recipeEditLink)

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
        var dataDate = new Date(recipe.date)
        recipeDate.innerText = `${dataDate.toLocaleString('default', { month: 'long', year: 'numeric'})}`

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

        var recipeCommentsList = document.getElementById("recipeCommentsList")
        for (const comment of recipe.comments) {
            var commentLI = document.createElement("LI")
            var commentDiv = document.createElement("DIV")
            var commentUser = document.createElement("H5")
            var commentDate = document.createElement("SPAN")
            var commentText = document.createElement("P")

            console.log(comment)
            commentDiv.setAttribute("class", "info")
            commentUser.innerText = comment.name
            commentText.innerText = comment.comment

            commentDate.setAttribute("style", "float:right")
            commentDate.innerText = `${(new Date(comment.date)).toLocaleString('default', { month: 'long', year: 'numeric'})}`

            commentDiv.appendChild(commentUser)
            commentDiv.appendChild(commentDate)

            commentLI.appendChild(commentDiv)
            commentLI.appendChild(commentText)

            recipeCommentsList.appendChild(commentLI)
        }
    }).catch(err => {
        console.log("AWS ERROR")
        console.log(err)
    })
}

function insertComment() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    const appID = "recipebook-dmxhi"
    const stitchClient = stitch.Stitch.getAppClient(appID)

    console.log(stitchClient.auth.user.id)

    const filterDoc = {
        _id: new stitch.BSON.ObjectId(idParam)
    };

    newCommentName = document.getElementById("newCommentName")
    newCommentText = document.getElementById("newCommentText")

    if (newCommentText && newCommentName) {
        loginAnon(function(recipesColl, isAdmin) {
            recipesColl.updateOne(filterDoc, {
                $push: {
                    comments: {
                        user_id: stitchClient.auth.user.id,
                        name: newCommentName.value,
                        comment: newCommentText.value,
                        date: new Date(),
                    }
                }
            }).then(result => {
                alert("inserted comment!")
                onServingsSelect()
            }).catch(err => {
                console.log(err)
                alert("error inserting comment")
            })
        })
    }
}

function onServingsSelect() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    var servingsMultiple = document.getElementById("servingsMultiple")

    window.location.href = `./recipe.html?id=${idParam}&mult=${servingsMultiple.value}`
}