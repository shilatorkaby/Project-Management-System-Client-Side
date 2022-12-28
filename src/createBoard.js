import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";
import { validateTitle, titleConstraint } from "./validations";

const statusesList = new Array();
const typesList = new Array();

const initCreateBoard = (key) => {

  $("#create-button").on("click", () => {
    let title = $("#title").val();

    if (validateTitle(title)) {
      fetch(serverAddress + "/board/create", {
        method: "POST",
        body: JSON.stringify({ title: title, statuses: statusesList, types: typesList }),
        headers: {
          "Content-Type": "application/json",
          Authorization: key.token.data,
        },
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log(title + " created successfully");
          window.history.pushState({}, "", "/archive");
          urlLocationHandler();
        }
      });
    } else {
      $("#board-settings-alert").html(titleConstraint("Board"));         
      console.log("Board title input is not valid!");
    }
  });

  $("#add-status").on("click", function () {
    $("#board-settings-alert").html("");
    const status = document.getElementById("status-input").value;
    if (validateTitle(status)) {
      addStatus(status);
    } else {
      $("#board-settings-alert").html(titleConstraint("Status"));      
      console.log("Status title input is not valid!");
    }
  });

  $("#add-types").on("click", function () {
    $("#board-settings-alert").html("");    
    const type = document.getElementById("type-input").value;
    if (validateTitle(type)) {
      addTypes(type);
    } else {
      $("#board-settings-alert").html(titleConstraint("Type"));      
      console.log("Type title input is not valid!");
    }
  });

};

const addStatus = (status) => {

  console.log("new status added: " + status);

  var statusTextNode = document.createTextNode(status);
  var li = document.createElement("li");
  li.appendChild(statusTextNode);
  statusesList.push(status);
  document.getElementById("statuses-table").appendChild(li);
};

const addTypes = (type) => {

  console.log("new type added: " + type);

  var typeTextNode = document.createTextNode(type);
  var li = document.createElement("li");
  li.appendChild(typeTextNode);
  typesList.push(type);
  document.getElementById("types-table").appendChild(li);
};

export { initCreateBoard };
