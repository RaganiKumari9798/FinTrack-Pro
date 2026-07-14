const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

document.getElementById("showLogin").addEventListener("click", function(e){
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

document.getElementById("showRegister").addEventListener("click", function(e){
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

// Register
document.getElementById("register").addEventListener("submit", function(e){

    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registration Successful!");

    this.reset();

    registerForm.style.display = "none";
    loginForm.style.display = "block";

});

// Login
document.getElementById("login").addEventListener("submit", function(e){

    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if(
        username === localStorage.getItem("username") &&
        password === localStorage.getItem("password")
    ){
        alert("Login Successful");

        // Redirect to dashboard
        window.location.href = "dashboard.html";

    }else{
        alert("Invalid Username or Password");
    }

});