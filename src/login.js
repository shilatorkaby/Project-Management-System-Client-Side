import $ from "jquery";
import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import { validateEmail, validatePassword } from "./validations";

const initLogin = async (key) => {
 

  const client_Id = "71c2e93a422a96bbf6e4";
  $("#register-git-btn").on("click", async () => {

    window.location.assign(`https://github.com/login/oauth/authorize?scope=user:email&client_id=${client_Id}`);
  })

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  console.log("code:");
  console.log(code);
  
  if (code != undefined) {

    fetch(serverAddress + "/user/registerViaGitHub?code=" + code, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status != 200) {
        document.getElementById("login-alert").innerHTML = response.message;
        console.log("Error in git authentication");
        return null;
      };
      return response.json();
    })
    .then(async (data) => {
      if (data != null) {
        console.log(data);
        console.log(key);
        key.token = data;
        localStorage.setItem("token", data);

        window.history.pushState({}, "", "/archive");
        await urlLocationHandler();
      }
    });
  }
  $("#login-button").on("click", async () => {
    const user = {
      email: $("#login-email").val(),
      password: $("#login-password").val(),
    };
    console.log("#login-button");


    if (validateEmail(user.email)) {
      if (validatePassword(user.password)) {
        console.log("good validation");

        await fetch(serverAddress + "/user/login", {
          method: "POST",
          body: JSON.stringify({ email: user.email, password: user.password }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status != 200) {
              document.getElementById("login-alert").innerHTML = "User does not exist in the system! please register first";
              console.log("User does not exist in the system, please register first");
              return null;
            };
            return response.json();
          })
          .then(async (data) => {
            if (data != null) {
              key.token = data;
              localStorage.setItem("token", data);

              window.history.pushState({}, "", "/archive");
              await urlLocationHandler();
            }
          });
      } else {
        document.getElementById("login-alert").innerHTML =
          "Password input is not valid!";
        console.log("Password input is not valid!");;
      }
    }
    else {
      document.getElementById("login-alert").innerHTML =
        "Email input is not valid!";
    }
  });
}

export { initLogin };

