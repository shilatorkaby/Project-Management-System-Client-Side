import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";
import { Buffer } from 'buffer'

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

  $("#status-name").html("Under status: '" + status+"'");

  displayTypesList(board);
  displayStatusItemsList(board);

  $("#create-button").on("click", () => {
    let title = $("#title").val();
    let type = $("#types-select :selected").val();
    let parentId = $("#items-select :selected").val();
    let creatorId = Buffer.from(token, 'base64').toString('binary').split("-")[1];
    let importance = $("#importance-select :selected").val();
    let dueDate = $("#item-due-date").val();
    let description = $("#description").val();

    function replacer(key, value) {
      if (value == "") {
        return undefined
      }
      return value;
    }

    let item = { title: title, status: status, type: type, parentId: parentId, creatorId: creatorId, assignedToId: creatorId, importance: importance, dueDate: dueDate, description: description };
    console.log(JSON.stringify(item, replacer));

    if (title.length != 0) {
      document.getElementById("create-item-alert").innerHTML = "";

      fetch(serverAddress + "/board/addItem", {
        method: "POST",
        body: JSON.stringify(item, replacer),
        headers: {
          "Content-Type": "application/json",
          Authorization: key.token.data,
          boardId: boardId
        },
      }).then((response) => {
        return (response.status >= 200 && response.status) <= 204 ? response.json() : null;
      }).then((updatedBoard) => {
        if (updatedBoard != null) {
          console.log(title + " item created successfully");
          window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
          urlLocationHandler();
        }
      });

    } else {
      document.getElementById("create-item-alert").innerHTML = "Item must have title";
    }

  });


  $("#close-icon").on("click", () => {
    window.history.pushState({ board: board }, "", "/board-view");
    urlLocationHandler();
  });

}

const displayTypesList = (board) => {
  var typesSelect = document.getElementById('types-select')
  $("#types-select").empty();

  var opt = document.createElement('option');
  opt.text = "no-type";
  opt.value = "";
  typesSelect.appendChild(opt);
  for (const type of board.types) {
    var opt = document.createElement('option');
    opt.value = type;
    opt.text = type;
    typesSelect.appendChild(opt);

  }
}

const displayStatusItemsList = (board) => {
  var itemsSelect = document.getElementById('items-select')
  $("#items-select").empty();

  var opt = document.createElement('option');
  opt.text = "no-parent-item";
  opt.value = "";
  itemsSelect.appendChild(opt);

  for (const status of board.statuses) {
  for (const item of board.items[status]) {
      var opt = document.createElement('option');
      opt.value = item.id;
      opt.text = item.title;
      itemsSelect.appendChild(opt);


  }

  }
}

export { initCreateItem };
