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
  onSetDescriptionClick(board);
  onSetTypeClick(board);
  onSetStatusClick(board);
  onSetParentClick(board);
  onSetImportanceClick(board);
  onSetDueDateClick(board);

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
    let itemRequest = { itemId: item.id, title: title };

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
        return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
      }).then((updatedBoard) => {
        if (updatedBoard != null) {
          console.log("item's title was updated successfully");
          window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
          urlLocationHandler();
        }
      }).catch(error => {
        document.getElementById("edit-item-alert").innerHTML = `Error: ${error}`;
      });
    } else {
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    }
  })
}

const onSetDescriptionClick = (board) => {
  $("#set-description-btn").on("click", () => {
    let description = document.getElementById("set-description-input").value;
    let itemRequest = { itemId: item.id, description: description };

    fetch(serverAddress + "/board/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_DESCRIPTION"
      },
    }).then((response) => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's description was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    });
  })
}

const onSetTypeClick = (board) => {
  $("#set-type-btn").on("click", () => {
    let type = document.getElementById("set-type-select").value.replace("-", " ");
    let itemRequest = { itemId: item.id, type: type };

    fetch(serverAddress + "/board/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_TYPE"
      },
    }).then((response) => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's type was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    });
  })
}

const onSetStatusClick = (board) => {
  $("#set-status-btn").on("click", () => {
    let status = document.getElementById("set-status-select").value.replace("-", " ");
    let itemRequest = { itemId: item.id, status: status };

    fetch(serverAddress + "/board/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_STATUS"
      },
    }).then((response) => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's status was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      console.log(error);
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    });
  })
}

const onSetParentClick = (board) => {
  $("#set-parent-btn").on("click", () => {
    let parentId = document.getElementById("set-parent-select").value;
    let itemRequest = { itemId: item.id, parentId: parentId };

    fetch(serverAddress + "/board/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_PARENT"
      },
    }).then(response => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's parent was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      console.log(error);
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    });
  })
}


const onSetImportanceClick = (board) => {
  $("#set-importance-btn").on("click", () => {
    let importance = document.getElementById("set-importance-select").value;
    let itemRequest = { itemId: item.id, importance: importance };

    fetch(serverAddress + "/board/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_IMPORTANCE"
      },
    }).then((response) => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's importance was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    });
  })
}

const onSetDueDateClick = (board) => {
  $("#set-due-date-btn").on("click", () => {
    let dueDate = document.getElementById("item-due-date").value;
    let itemRequest = { itemId: item.id, dueDate: dueDate };

    fetch(serverAddress + "/board/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_DUE_DATE"
      },
    }).then((response) => {
      return response.ok ? response.json() : response.text().then(text => { throw new Error(text)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's due date was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      document.getElementById("edit-item-alert").innerHTML = `Error: ${error}`;
    });
  })
}

export { initEditItem };
