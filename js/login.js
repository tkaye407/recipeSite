function loginAnon(onLogin) {
    // Initialize the App Client
    const appID = "recipebook-dmxhi"

    var stitchClient
    if (stitch.Stitch.hasAppClient(appID)) {
        stitchClient = stitch.Stitch.getAppClient(appID)
    } else {
        stitchClient = stitch.Stitch.initializeAppClient(appID)
    }

    // Get a MongoDB Service Client
    const mongoClient = stitchClient.getServiceClient(
        stitch.RemoteMongoClient.factory,
        "mongodb-atlas"
    );

    // Get a reference to the items database
    const recipesColl = mongoClient.db("test").collection("recipes");

    if (stitchClient.auth.isLoggedIn == false) {
        stitchClient.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user => {
            console.log(`Logged in as anonymous user with id: ${user.id}`);
            if (onLogin != null && onLogin != undefined) {
                onLogin(recipesColl, false)
            }
        }, (error) => {
            console.log(error);
        });
    }
    if (onLogin != null && onLogin != undefined) {
        if (stitchClient.auth.user.loggedInProviderType === "local-userpass") {
            console.log(`Already logged in as admin user with id: ${stitchClient.auth.user.id}`);
            onLogin(recipesColl, true)
        } else {
            console.log(`Already logged in as anonymous user with id: ${stitchClient.auth.user.loggedInProviderType}`);
            onLogin(recipesColl, false)
        }
    }
}

function loginUser() {
    const appID = "recipebook-dmxhi"

    var stitchClient
    if (stitch.Stitch.hasAppClient(appID)) {
        stitchClient = stitch.Stitch.getAppClient(appID)
    } else {
        stitchClient = stitch.Stitch.initializeAppClient(appID)
    }

    // Get a MongoDB Service Client
    const mongoClient = stitchClient.getServiceClient(
        stitch.RemoteMongoClient.factory,
        "mongodb-atlas"
    );

    // Get a reference to the items database
    const recipesColl = mongoClient.db("test").collection("recipes");

    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    console.log(username)
    console.log(password)

    const credential = new stitch.UserPasswordCredential(username, password)

    stitchClient.auth.loginWithCredential(credential).then(user => {
        window.location.href = './insert.html'
    }).catch(err => {
        alert(`Failed to login with error: ${err}`)
    })
}
