import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";
import { validateTitle, titleConstraint } from "./validations";
import { Buffer } from 'buffer';

let token;
let board;
let status;

const initCreateItem = (key) => {
  console.log("arrived to item create");

  board = history.state.board;
  status = history.state.status;
  status = status.replace("-", " ");
  token = key.token.data;

  $("#status-name").html("Under status: '" + status + "'");

  displayTypesList(board);
  displayParentItemsList(board);
  displayAuthUsersEmailsList(board.authorizedUsers);
  onCreateItemClick(board);
  onClose(board);
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

const onCreateItemClick = (board) => {
  $("#create-button").on("click", () => {

    let title = $("#title").val();
    let type = $("#types-select :selected").val();
    let parentId = $("#items-select :selected").val();
    let creatorId = Buffer.from(token, 'base64').toString('binary').split("-")[1];
    let importance = $("#importance-select :selected").val();
    let dueDate = $("#item-due-date").val();
    let description = $("#description").val();
    let assignedToId = $("#users-select :selected").val();

    function replacer(key, value) {
      if (value == "") {
        return undefined
      }
      return value;
    }

    let item = { title: title, status: status, type: type, parentId: parentId, assignedToId: assignedToId, creatorId: creatorId, importance: importance, dueDate: dueDate, description: description };

    if (validateTitle(title)) {
      document.getElementById("create-item-alert").innerHTML = "";

      fetch(serverAddress + "/item/addItem", {
        method: "POST",
        body: JSON.stringify(item, replacer),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          boardId: board.id,
          action: "CREATE_ITEM"
        },
      }).then((response) => {
        if (response.status === 401) {
          document.getElementById("create-item-alert").innerHTML = "You are unauthorized to create items";
        }
        return (response.status >= 200 && response.status) <= 204 ? response.json() : null;
      }).then((updatedBoard) => {
        if (updatedBoard != null) {
          console.log(title + " item created successfully");
          window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
          urlLocationHandler();
        }
      });

    } else {
      document.getElementById("create-item-alert").innerHTML = titleConstraint("Item");
      console.log("Invalid item title input");
    }

  });
}

const onClose = (board) => {
  $("#close-icon").on("click", () => {
    window.history.pushState({ board: board }, "", "/board-view");
    urlLocationHandler();
  });
}

const displayParentItemsList = (board) => {
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

const displayAuthUsersEmailsList = (authUsers) => {
  var usersSelect = document.getElementById('users-select')
  $("#users-select").empty();

  var opt = document.createElement('option');
  opt.text = "no-assign";
  opt.value = "";
  usersSelect.appendChild(opt);
  for (const authUser of authUsers) {
    var opt = document.createElement('option');
    opt.value = authUser.id;
    opt.text = authUser.email;
    usersSelect.appendChild(opt);
  }
}

export { initCreateItem };