// Firebase
//Firebase API using jQuery's Deferred for promises
var myFirebaseRef = new Firebase("https://visual-cs.firebaseio.com");
var currentUser = {};

function clickHandler(e) {
    console.log("Clicked");
    var button = e.target;
    while (!button.hasAttribute('data-dialog') && button !== document.body) {
        button = button.parentElement;
    }
    if (!button.hasAttribute('data-dialog')) {
        return;
    }
    var id = button.getAttribute('data-dialog');
    var dialog = document.getElementById(id);
    console.log(id);
    console.log(dialog);
    if (dialog) {
        dialog.open();
    }
}

function signIn() {
    var email = document.getElementById('sign_in_email').value;
    var password = document.getElementById('sign_in_password').value;
    myFirebaseRef.authWithPassword({
        email: email,
        password: password
    }, authHandler);

    document.getElementById('sign_in_modal').close();
}

// create a user but not login
// returns a promsie
function createUser(userObj) {
    var deferred = $.Deferred();
    myFirebaseRef.createUser(userObj, function (err) {

        if (!err) {
            console.log("User created");
            deferred.resolve();
        } else {
            console.log(err);
            deferred.reject(err);
        }

    });

    return deferred.promise();
}

// Create a user and then login in
// returns a promise
function createUserAndLogin(userObj) {
    console.log("Create user and login");
    return createUser(userObj)
        .then(function () {
          console.log("User created, now move to authentication");
        return authWithPassword(userObj);
        })
        .then(function () {
          console.log("createUserAndLogin completed");
          var authData = myFirebaseRef.getAuth();
          if(authData){
            saveUser(authData);
          }
        });;
}

function saveUser(userObj){
  myFirebaseRef.child("users").child(userObj.uid).set({
    provider: userObj.provider,
    email: userObj.password.email,
    name: getName(userObj)
  });  
}

// Handle Email/Password login
// returns a promise
function authWithPassword(userObj) {
    var deferred = $.Deferred();
    console.log("Authenticate user");
    
    myFirebaseRef.authWithPassword(userObj, function onAuth(err, user) {
        if (err) {
            console.log("Error authenticating");
            console.log(err);
            deferred.reject(err);
        }

        if (user) {
            console.log("User authenticated");

            var currentUser = myFirebaseRef.getAuth();
            var userRef = new Firebase('https://mini-course.firebaseio.com/users/'+currentUser.uid);
        
            userRef.once('value', function(snapshot) {
                var user = snapshot.val();
                console.log(user.name);
                $('nav .account-action').html('<li>Hi, ' + user.name + '</li><li><a href="#" id="logout">Logout</a></li>');
            });

            loadCurrentUserProject();

            deferred.resolve(user);
        }

    });

    return deferred.promise();
}

// find a suitable name based on the meta info given by each provider
function getName(authData) {
    switch (authData.provider) {
        case 'password':
            return authData.password.email.replace(/@.*/, '');
        case 'twitter':
            return authData.twitter.displayName;
        case 'facebook':
            return authData.facebook.displayName;
    }
}

function logout(){
  myFirebaseRef.unauth(function(){
    console.log("Logout successful");
  });
  $('nav ul.account-action').html('<li><a href="#" data-reveal-id="signupModal">Login</a></li><li><a class="signup" href="#" data-reveal-id="signupModal">Signup</a></li>');
  $(document).foundation();
}

function saveProject() {
    var currentUser = myFirebaseRef.getAuth();
    if (currentUser) {
        myFirebaseRef.child("projects").child(currentUser.uid).set({
            "files": {
                "html": {
                    "content": editor.getValue()
                }
            }
        });
    } else {
        alert("Please sign in to save your work");
    }
}

function getCurrentUser(){
    return myFirebaseRef.getAuth();
}