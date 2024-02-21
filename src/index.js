import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { changeRoute, lastPageLoaded, loginNav, addRow, addRecipe, viewRecipe, editRecipe, deleteRecipe, setEditPage } from "../dist/services/services.js";

export var userName;

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBzZQsPdoefcWyPm4MKHPTEBeTnxmsRslI",
    authDomain: "n315-cc.firebaseapp.com",
    projectId: "n315-cc",
    storageBucket: "n315-cc.appspot.com",
    messagingSenderId: "124018914014",
    appId: "1:124018914014:web:df6f512caa8a82d124484f",
    measurementId: "G-XEWMTQLJXY"
});

const auth = getAuth(firebaseApp);

// detect auth state

onAuthStateChanged(auth, (user) => {
    if (user != null) 
    {
        console.log("user logged in");
        console.log("authstate: ", user);
        $(".yourRecipes").removeClass("hide");
        loginNav.forEach((element) => {
            element.innerHTML = 'Logout';
        });

        userName = auth.currentUser.displayName;
        console.log("username in auth: " + userName);
    } 
    else 
    {
        console.log("no user");
        $(".yourRecipes").addClass("hide");
        userName = null;
    }
});

// App.js 
var mobileBtn = document.getElementById("hamburger");
console.log(mobileBtn);


function initListeners() {
    mobileBtn.addEventListener("click", () => {
        mobileBtn.classList.toggle("open");
    });

    $(".cancelBtn").on("click", () => {
        window.location.hash = "home";
        $(".recipeModal").toggleClass("hide");
    })

    $(".cancelDelete").on("click", () => {
        $(".deleteModal").toggleClass("hide");
    })

    

    window.addEventListener("hashchange", changeRoute);
}

export function initFormListeners() {
    $(".imageBtn").on("click", () => {
        $("#imagePath").val("https://picsum.photos/300/270");
    })
    $(".ingredientBtn").on("click", function () {
        addRow(".formIngredients");
    })
    $(".instructionBtn").on("click", function () {
        addRow(".formInstructions");
    })
    $(".submit").on("click", function () {
        addRecipe();
    })
}

export function initRecipesListeners() {
    $("#noRecipes").on("click", function () {
        window.location.hash = "create";
    })
    $(".viewBtn").on("click", function () {
        let recipeIndex = $(this).parent().attr("data-index")
        viewRecipe(recipeIndex);
    })
    $(".editBtn").on("click",function () {
        let recipeIndex = $(this).parent().parent().attr('data-index');
        window.location.hash = "edit";
        

        setTimeout(function () {
            setEditPage(recipeIndex);
            $(".submitChanges").on("click", function () {
                editRecipe(recipeIndex);
            })
        }, 1000);
    })
    $(".deleteBtn").on("click", () => {
        let recipeIndex = $(this).parent().attr("data-index");

        $(".deleteModal").toggleClass("hide");

        $(".confirmDelete").on("click", () => {
            deleteRecipe(recipeIndex);
            $(".confirmDelete").off("click", "**");
        })
    })
}

export function accountHandler(pageID) {
    console.log(auth.currentUserser);
    if (pageID === 'loginPage')
    {
        if (loginNav[0].innerHTML === 'Logout')
        {
            signOut(auth);
            loginNav.forEach((element) => {
                element.innerHTML = 'Login';
            })
            return;
        }
        else
        {
            return;
        }
    }

    // Sign up inputs
    let emailAddress = $("#emailSU").val();
    let firstName = $("#firstNameSU").val();
    let lastName = $("#lastNameSU").val();
    let password = $("#passwordSU").val();

    // Login Inputs
    let loginEmail = $("#loginEmail").val();
    let loginPassword = $("#loginPassword").val();

    if (pageID === 'signUp')
    {
        createUserWithEmailAndPassword(auth, emailAddress, password)
        .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
            displayName: firstName
        }).catch((error) => {
            console.log(error);
        })

        console.log("sign up username: " + user.displayName);



        loginNav.forEach((element) => {
            element.innerHTML = 'Logout';
        });
        window.location.hash = `${lastPageLoaded}`;

        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
        });
    }
    else if (pageID === 'login')
    {
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then((userCredential) => {
            const user = userCredential.user;

            loginNav.forEach((element) => {
                element.innerHTML = 'Logout';
            });
            window.location.hash = `${lastPageLoaded}`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }
}

$(document).ready(function () {
    initListeners();
    changeRoute();
})