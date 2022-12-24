import $ from "jquery";

import {urlLocationHandler} from "./router";
import { serverAddress } from "./constants";
import {Buffer} from 'buffer'

let boardId;
let token;
let board;
let status;

const initCreateItem = (key) => {
  console.log("arrived to item create");

  board = history.state.board;
  console.log(history.state.board)

  boardId = board.id;
  status = history.state.status; 
  token = key.token.data; 

  $("#status-input").attr("placeholder", status);

  displayTypesList(board);
  displayItemsList(board,status);

  $("#create-button").on("click", () => {
    let title = $("#title").val();
    let type = $("#types-select :selected").val();
    let parentId = $("#items-select :selected").val();  
    let creatorId = Buffer.from(token, 'base64').toString('binary').split("-")[1];
    

    console.log(JSON.stringify({title: title, status: status, type: type, parentId: parentId, creatorId: creatorId}))
  
    if (title.length != 0) {       
      
      fetch(serverAddress + "/board/addItem", {
        method: "POST",
        body: JSON.stringify({title: title, status: status, type: type, parentId: parentId, creatorId: creatorId}),
        headers: {
          "Content-Type": "application/json",          
          Authorization: key.token.data,
          boardId: boardId
        },
      }).then((response) => {
        if (response.status >= 200 && response.status <300) {
          console.log(title + " item created successfully");
          window.history.pushState({}, "", "/archive");
          urlLocationHandler();
        }
      });
      
    }
  });
}

const displayTypesList = (board) => {  
  var typesSelect = document.getElementById('types-select') 
  $("#types-select").empty();

  //let indexType = 0;
  for (const type of board.types) {
      var opt = document.createElement('option');
      opt.value = type;
      opt.text = type;
      typesSelect.appendChild(opt);
      //indexType += 1;
  }
}

const displayItemsList = (board,status) => {  
  var itemsSelect = document.getElementById('items-select') 
  $("#items-select").empty();

  //let indexItem = 0;  
  var opt = document.createElement('option');
  opt.value = null;      
  opt.text = "no-parent-item";
  itemsSelect.appendChild(opt);
  for (const item of board.items[status]) {
      var opt = document.createElement('option');
      opt.value = item.id;      
      opt.text = item.title;
      itemsSelect.appendChild(opt);
      //indexItem += 1;
  }
}

const getIdfromToken = (token) => {

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
