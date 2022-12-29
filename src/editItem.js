import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";
import { validateTitle, titleConstraint } from "./validations";

var board;
var item;
var token;

const initEditItem = (key) => {
  board = history.state.board;
  item = history.state.item;
  token = key.token.data;

  onClose(board);
  onSetTitleClick(board);
  onSetDescriptionClick(board);
  onSetTypeClick(board);
  onSetStatusClick(board);
  onSetParentClick(board);
  onSetUserClick(board);
  onSetImportanceClick(board);
  onSetDueDateClick(board);

  displayItemTitle(item);
  displayItemDescription(item);
  displayTypesList(board);
  displayStatusItemsList(board);
  displayParentItemsList(board, item);
  displayAuthorizedList(board.authorizedUsers);
};

const onClose = (board) => {
  $("#close-icon").on("click", () => {
    window.history.pushState({board: board}, "", "/board-view");
    urlLocationHandler();
  })
}

const displayItemTitle = (item) => {
  document.getElementById("set-title-input").placeholder = item.title;
}

const displayItemDescription = (item) => {
  if (item.description != ""){
  document.getElementById("set-description-input").placeholder = item.description;
  }
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

const displayParentItemsList = (board, itemToEdit) => {
  var itemsSelect = document.getElementById('set-parent-select')
  $("#set-parent-select").empty();

  var opt = document.createElement('option');
  opt.text = "none";
  opt.value = 0;
  itemsSelect.appendChild(opt);

  for (const status of board.statuses) {
    for (const item of board.items[status]) {
      if (item.id != itemToEdit.id) {
        var opt = document.createElement('option');
        opt.value = item.id;
        opt.text = item.title;
        itemsSelect.appendChild(opt);
      }
    }
  }
}

const displayAuthorizedList = (authUsers) => {
  var usersSelect = document.getElementById('set-user-select')
  $("#set-user-select").empty();

  var opt = document.createElement('option');
  opt.text = "none";
  opt.value = "";
  usersSelect.appendChild(opt);

  for (const authUser of authUsers) {
    var opt = document.createElement('option');
    opt.value = authUser.id;
    opt.text = authUser.role + ": " + authUser.email;
    usersSelect.appendChild(opt);
  }
}

const onSetTitleClick = (board) => {
  $("#set-title-btn").on("click", () => {
    let title = document.getElementById("set-title-input").value;
    let itemRequest = { itemId: item.id, title: title };

    if (validateTitle(title)) {
      document.getElementById("edit-item-alert").innerHTML = "";

      fetch(serverAddress + "/item/updateItem", {
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
        document.getElementById("edit-item-alert").innerHTML = `${error}`;
      });
    } else {
      document.getElementById("edit-item-alert").innerHTML = titleConstraint("Item");
      console.log("Invalid item title input");
    }
  })
}

const onSetDescriptionClick = (board) => {
  $("#set-description-btn").on("click", () => {
    let description = document.getElementById("set-description-input").value;
    let itemRequest = { itemId: item.id, description: description };

    fetch(serverAddress + "/item/updateItem", {
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

    fetch(serverAddress + "/item/updateItem", {
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

    fetch(serverAddress + "/item/updateItem", {
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

    fetch(serverAddress + "/item/updateItem", {
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

const onSetUserClick = (board) => {
  $("#set-user-btn").on("click", () => {
    let userId = document.getElementById("set-user-select").value;
    let itemRequest = { itemId: item.id, assignedToId: userId };

    fetch(serverAddress + "/item/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "ASSIGN_ITEM"
      },
    }).then(response => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item was successfully assigned to user");
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

    fetch(serverAddress + "/item/updateItem", {
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

    fetch(serverAddress + "/item/updateItem", {
      method: "PATCH",
      body: JSON.stringify(itemRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        boardId: board.id,
        action: "SET_ITEM_DUE_DATE"
      },
    }).then((response) => {
      return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
    }).then((updatedBoard) => {
      if (updatedBoard != null) {
        console.log("item's due date was updated successfully");
        window.history.pushState({ board: updatedBoard.data }, "", "/board-view");
        urlLocationHandler();
      }
    }).catch(error => {
      document.getElementById("edit-item-alert").innerHTML = `${error}`;
    });
  })
}

export { initEditItem };
