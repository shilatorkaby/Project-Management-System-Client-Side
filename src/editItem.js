import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";


var board;
var item;
var token;

const initEditItem = (key) => {
  board = history.state.board;
  item = history.state.item;
  token = key.token.data;

  onClose();
  onSetTitleClick(board);

  displayItemTitle(item);
  displayTypesList(board);
  displayStatusItemsList(board);
  displayParentItemsList(board);
};

const onClose = () => {
  $("#close-icon").on("click", () => {
    window.history.pushState({}, "", "/boardView");
    urlLocationHandler();
  })
}

const displayItemTitle = (item) => {
  document.getElementById("set-title-input").placeholder = item.title;
}

const displayTypesList = (board) => {
  var typesSelect = document.getElementById('set-type-select')
  $("#set-type-select").empty();

  var opt = document.createElement('option');
  opt.text = "none";
  opt.value = null;
  typesSelect.appendChild(opt);

  for (const type of board.types) {
    var opt = document.createElement('option');
    opt.value = type;
    opt.text = type;
    typesSelect.appendChild(opt);
  }
}

const displayStatusItemsList = (board) => {
  var statusesSelect = document.getElementById('set-status-select')
  $("#set-status-select").empty();

  for (const status of board.statuses) {
    var opt = document.createElement('option');
    opt.value = status;
    opt.text = status;
    statusesSelect.appendChild(opt);
  }
}

const displayParentItemsList = (board) => {
  var itemsSelect = document.getElementById('set-parent-select')
  $("#set-parent-select").empty();

  var opt = document.createElement('option');
  opt.text = "none";
  opt.value = 0;
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

const onSetTitleClick = (board) => {
  $("#set-title-btn").on("click", () => {
    let title = document.getElementById("set-title-input").value;
    let itemRequest = {itemId: item.id, title: title};

    if (title.length > 0) {
      document.getElementById("edit-item-alert").innerHTML = "";

      fetch(serverAddress + "/board/updateItem", {
        method: "PATCH",
        body: JSON.stringify(itemRequest),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          boardId: board.id,
          action: "SET_ITEM_TITLE"
        },
      }).then((response) => {
        return (response.status >= 200 && response.status) <= 204 ? response.json() : null;
      }).then((updatedBoard) => {
        if (updatedBoard != null) {
          console.log(title + " item's title was updated successfully");
          window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
          urlLocationHandler();
        }
      });

    } else {
      document.getElementById("edit-item-alert").innerHTML = "Item must have title";
    }
  })
}

export { initEditItem };
