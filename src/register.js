import $ from "jquery";
import { validateEmail, validatePassword } from "./validations";
import { serverAddress } from "./constants";

const initRegister = () => {

  $(document).on("click", "#register-button", async () => {
    const user = {
      email: $("#register-email").val(),
      password: $("#register-password").val(),
    };
    
    console.log("#register-button");

    
    if (validateEmail(user.email)) {
       if(validatePassword(user.password)){

      fetch(serverAddress + "/user/register", {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password, loginMethod: "PASSWORD_BASED" }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => registerAlert(response));
     }
    else{
      document.getElementById("register-alert").innerHTML =
      "Password input is not valid!";
      console.log("Password input is not valid!");;
    }
  }
    else{
      document.getElementById("register-alert").innerHTML =
      "Email input is not valid!";
    }
  });

  
};

function registerAlert(response) {
  console.log("hi:" +response.status);
  if (response.status == 200) {
    document.getElementById("register-alert").innerHTML =
      "The registration was done successfully!\
      you can log in now";
  } else {
    document.getElementById("register-alert").innerHTML =
      "User is already registered! please log in";
      console.log("User is already registered! please log in");
  }
}

export { initRegister };
