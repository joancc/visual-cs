var projectsMap = {
    d3:{
        sandbox: {
            title: "Play around with D3",
            content: "Fast idea prototyping",
            next: null
        },
        intro:{
            title: "Intro to D3",
            content: "Simple bar charts",
            next: "d3IntroSVG"
        },
        svg:{
            title: "Introducing SVGs",
            content: "The SVG tag",
            next: null    
        }
    }
}


var currentProject = "d3";
var currentSection = "intro";

var fbBaseURL = "visual-cs";

$(document).ready(function() {
    $instructions = $("#instructions");
    //Set iframe as message receiver
    receiver = document.getElementById('preview').contentWindow;    

    $(document).on('click', '#loginButton', function(e) {
        e.preventDefault();
        console.log("login");
        console.log(this);

        var email = document.getElementById('sign_in_email').value;
        var password = document.getElementById('sign_in_password').value;
        authWithPassword({
            email: email,
            password: password
        }, authHandler);



        $('#signupModal').foundation('reveal', 'close');
    });

    $(document).on('click', '#logout', function(e) {
        e.preventDefault();
        console.log("logout");
        console.log(this);

        logout();
    });

    //Verify if user is currently logged in
    var currentUser = getCurrentUser();
    //Set welcome message
    if( currentUser ){
        var userRef = new Firebase('https://'+fbBaseURL+'.firebaseio.com/users/'+currentUser.uid);
        
        userRef.once('value', function(snapshot) {
            var user = snapshot.val();
            console.log(user.name);
            $('nav .account-action').html('<li>Hi, ' + user.name + '</li><li><a href="#" id="logout">Logout</a></li>');
        });        
    }

    loadCurrentUserProject();
});

function loadTemplate(){
    console.log("Loading project template");

    var courseRef = new Firebase('https://'+fbBaseURL+'.firebaseio.com/projects/_template/'+currentProject+'/'+currentSection);
    courseRef.once('value', function(snapshot) {
        var course = snapshot.val();
        console.log("Course retrieved: ");
        console.log(course);
        debug2 = course;
        //Set html
        if(course){
            if( course.hasOwnProperty("html") ){
                editor_html.setValue(course.html);        
            }
            if( course.hasOwnProperty("css") ){
                editor_css.setValue(course.css);        
            }
            if( course.hasOwnProperty("js") ){
                editor_js.setValue(course.js);        
            }
            
        }
    });
}

function loadCurrentUserProject(){
    
    currentUser = getCurrentUser();
    console.log("Load current project for ");
    console.log(currentUser);

    if(currentUser && currentUser.uid){
        var projectRef = new Firebase('https://'+fbBaseURL+'.firebaseio.com/projects/'+currentUser.uid+'/'+currentProject+'/'+currentSection);

        projectRef.once('value', function(snapshot) {
            project = snapshot.val();
            console.log("Users project");
            console.log(project);

            //Set html
            if(project){
                if( project.hasOwnProperty("html") ){
                    console.log("Setting html to");
                    console.log(project.html);
                    editor_html.setValue(project.html);        
                }
                if( project.hasOwnProperty("css") ){
                    console.log("Setting css to");
                    console.log(project.css);
                    editor_css.setValue(project.css);        
                }
                if( project.hasOwnProperty("js") ){
                    console.log("Setting js to");
                    console.log(project.js);
                    editor_js.setValue(project.js);        
                }
            }else{
                loadTemplate();
            }
        });
    }else{
        loadTemplate();
        console.log("No user signed in");
    }
}

function authHandler(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Authenticated successfully with payload:", authData);
        currentUser = authData;
        
    }
}

function saveProject(){
    if (currentUser) {
        var payload = {
                "html": editor_html.getValue(),
                "css": editor_css.getValue(),
                "js": editor_js.getValue()
            }; 

        myFirebaseRef.child("projects").child(currentUser.uid).child(currentProject).child(currentSection).set(payload, function(err){
            if(err){
                alert(err);
            }else{
                alert("Save successful");
            }
        });
    } else {
        alert("Please sign in to save your work");
    }
}

function nextLevel(){
    currentLevel == maxLevel ? maxLevel : currentLevel++;
    //Update iframe source
    $('iframe#preview').attr('src', 'project_template/index'+currentLevel+'.html');
    $instructions.find("h3").text(instructions["level"+currentLevel].title);
    $instructions.find("p").text(instructions["level"+currentLevel].content);
    loadCurrentUserProject();
}

function prevLevel(){
    currentLevel == 1 ? 1 : currentLevel--;
    
    //Update iframe source
    $('iframe#preview').attr('src', 'project_template/index'+currentLevel+'.html');
    $instructions.find("h3").text(instructions["level"+currentLevel].title);
    $instructions.find("p").text(instructions["level"+currentLevel].content);
    loadCurrentUserProject();
}

function sendMessageToPreview(data){
    receiver.postMessage(data, "http://localhost:3333/project_template/"+currentProject+"/"+currentSection+".html");
 }
