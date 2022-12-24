import $ from "jquery";

import {urlLocationHandler} from "./router";
import { serverAddress } from "./constants";
//const status = new Array();
//const typesList = new Array();

const initCreateItem = (key) => {

  $("#create-button").on("click", () => {
    let title = $("#title").val();

    if (title.length != 0) { 
      console.log(key.token.data);

      /*
      fetch(serverAddress + "/board/create", {
        method: "POST",
        body: JSON.stringify({title: title, statuses: statusesList ,types:typesList}),
        headers: {
          "Content-Type": "application/json",
          Authorization: key.token.data,
        },
      }).then((response) => {
        if (response.status >= 200 && response.status <300) {
          console.log(title + " created successfully");
          window.history.pushState({}, "", "/archive");
          urlLocationHandler();
        }
      });
      */
    }
  });
}

  /*
  $("#add-status").on("click", function () {
    const status = document.getElementById("status-input").value;
    if (status.length > 0) {
      addStatus(status);
      }
  });
  
  $("#add-types").on("click", function () {
    const status = document.getElementById("type-input").value;
    if (status.length > 0) {
      addTypes(status);
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
*/

export { initCreateItem };
