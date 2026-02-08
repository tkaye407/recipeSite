function loadInsertOrReplace() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        return
    }

    const baseImageName = "https://sjkrecipesite.s3.amazonaws.com/"


    var apigClient = apigClientFactory.newClient();
    apigClient.recipesRecipeIdGet({
        recipe_id: idParam
    }, {}).then(result => {
        var recipe = result.data;
        console.log("Inserting New Recipe: ", recipe)

        var name = document.getElementById("name")
        name.value = recipe.title

        var servings = document.getElementById("servings")
        servings.selectedIndex = recipe.servings - 1

        var rating = document.getElementById("rating")
        rating.selectedIndex = recipe.rating - 1

        var difficulty = document.getElementById("difficulty")
        difficulty.selectedIndex = recipe.difficulty - 1

        var timeReq = document.getElementById("timeReq")
        timeReq.value = recipe.time

        var timeUnit = document.getElementById("timeUnit")
        if (recipe.timeUnit === "hours") {
            timeUnit.selectedIndex = 1
        }

        for (tag of recipe.tags) {
            var elem = document.getElementById(`is${tag.charAt(0).toUpperCase()}${tag.slice(1)}`)
            if (elem) {
                elem.checked = true
            }
        }

        var imageName = document.getElementById("image")
        if (recipe.image.indexOf(baseImageName) === 0) {
            imageName.value = recipe.image.slice(baseImageName.length)
        }

        // Create all ingredient fields 
        var index = 0
        for (var ingredient of recipe.ingredients) {
            if (index > 0) {
                insertIngredient()
            }
            index += 1

            document.getElementById(`ingredient${index}`).value = ingredient.name
            document.getElementById(`ingredientQuantity${index}`).value = ingredient.quantity
            document.getElementById(`ingredientUnit${index}`).value = ingredient.metric
        }

        // Create all instruction fields 
        index = 0
        for (var instruction of recipe.instructions) {
            if (index > 0) {
                insertInstruction()
            }
            index += 1

            document.getElementById(`instruction${index}`).value = instruction
        }
    })
}

function insertOrReplaceRecipe() {
    const baseImageName = "https://sjkrecipesite.s3.amazonaws.com/"

    var name = document.getElementById("name").value
    var imageName = baseImageName + document.getElementById("image").value
    var servings = parseInt(document.getElementById("servings").value, 10)
    var rating = parseInt(document.getElementById("rating").value, 10)
    var difficulty = parseInt(document.getElementById("difficulty").value, 10)
    var timeReq = Number(document.getElementById("timeReq").value)
    if (Number.isNaN(timeReq)) {
        timeReq = 0
    }
    var timeUnit = document.getElementById("timeUnit").value

    const possibleTags = ["isMeat", "isChicken", "isFish", "isApp", "isSide", "isDessert", "isSoup", "isSalad", "isPasta", "isBrunch"]
    var tags = []
    for (possibleTag of possibleTags) {
        var elem = document.getElementById(possibleTag)
        if (elem.checked) {
            tags.push(elem.value)
        }
    }

    var ingredients = []
    var num = 0
    while (true) {
        num = num + 1

        ingredient = document.getElementById(`ingredient${num}`)
        if (ingredient == undefined || ingredient == null || ingredient.value == "") {
            break
        }

        var ingredientQuantity = Number(document.getElementById(`ingredientQuantity${num}`).value)
        if (Number.isNaN(ingredientQuantity)) {
            ingredientQuantity = 0
        }

        ingredientUnit = document.getElementById(`ingredientUnit${num}`).value

        ingredients.push({
            "name": ingredient.value,
            "quantity": ingredientQuantity,
            "metric": ingredientUnit
        })
    }

    var instructions = []
    num = 0
    while (true) {
        num = num + 1

        instruction = document.getElementById(`instruction${num}`)
        if (instruction == undefined || instruction == null || instruction.value == "") {
            break
        }

        instructions.push(instruction.value)
    }

    newRecipe = {
        title: name,
        rating: rating,
        image: imageName,
        date: new Date(),
        author: "Sheryl Kaye",
        time: timeReq,
        timeUnit: timeUnit,
        difficulty: difficulty,
        rating: rating,
        servings: servings,
        tags: tags,
        ingredients: ingredients,
        instructions: instructions
    }
    console.log(JSON.stringify(newRecipe))

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    var apigClient = apigClientFactory.newClient();

    if (!idParam) {
        apigClient.recipesPost({}, newRecipe, {}).then(result => {
            alert("inserted recipe!")
            console.log("added recipe")
        }).catch(err => {
            console.log(err)
            alert("error inserting recipe")
        })
    } else {
        apigClient.recipesRecipeIdPatch({recipe_id: idParam}, newRecipe, {}).then(result => {
            alert("updated recipe!")
            console.log("updqted recipe")
        }).catch(err => {
            console.log(err)
            alert("error updating recipe")
        })
    }
}

function insertIngredient() {
    var ingredientAddButton = document.getElementById("ingredientAddButton")
    var ingredientList = document.getElementById("ingredientList")

    var newTopDiv = document.createElement("DIV")
    newTopDiv.setAttribute("class", "form-group")

    var newEmptyLabel = document.createElement("LABEL")
    newEmptyLabel.setAttribute("class", "control-label col-sm-2")


    // Quantity Input
    var quantityDiv = document.createElement("DIV")
    quantityDiv.setAttribute("class", "col-sm-2")

    var quantityInput = document.createElement("INPUT")
    quantityInput.setAttribute("type", "number")
    quantityInput.setAttribute("class", "form-control")
    quantityInput.setAttribute("id", `ingredientQuantity${ingredientList.childElementCount}`)

    quantityDiv.appendChild(quantityInput)


    // Unit Input 
    var unitDiv = document.createElement("DIV")
    unitDiv.setAttribute("class", "col-sm-2")

    var unitInput = document.createElement("INPUT")
    unitInput.setAttribute("type", "text")
    unitInput.setAttribute("class", "form-control")
    unitInput.setAttribute("id", `ingredientUnit${ingredientList.childElementCount}`)

    unitDiv.appendChild(unitInput)

    // Name Input
    var nameDiv = document.createElement("DIV")
    nameDiv.setAttribute("class", "col-sm-4")

    var nameInput = document.createElement("INPUT")
    nameInput.setAttribute("type", "text")
    nameInput.setAttribute("class", "form-control")
    nameInput.setAttribute("id", `ingredient${ingredientList.childElementCount}`)

    nameDiv.appendChild(nameInput)

    // Build up 
    newTopDiv.appendChild(newEmptyLabel)
    newTopDiv.appendChild(quantityDiv)
    newTopDiv.appendChild(unitDiv)
    newTopDiv.appendChild(nameDiv)
    ingredientList.insertBefore(newTopDiv, ingredientAddButton)
}

function insertInstruction() {
    var instructionAddButton = document.getElementById("instructionAddButton")
    var instructionList = document.getElementById("instructionList")

    var newTopDiv = document.createElement("DIV")
    newTopDiv.setAttribute("class", "form-group")

    var newEmptyLabel = document.createElement("LABEL")
    newEmptyLabel.setAttribute("class", "control-label col-sm-2")

    var newDiv = document.createElement("DIV")
    newDiv.setAttribute("class", "col-sm-8")

    var newInput = document.createElement("INPUT")
    newInput.setAttribute("type", "text")
    newInput.setAttribute("class", "form-control")
    newInput.setAttribute("id", `instruction${instructionList.childElementCount}`)

    newDiv.appendChild(newInput)
    newTopDiv.appendChild(newEmptyLabel)
    newTopDiv.appendChild(newDiv)


    instructionList.insertBefore(newTopDiv, instructionAddButton)
}