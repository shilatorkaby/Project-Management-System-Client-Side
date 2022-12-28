import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";

var board;
var item;
var token;

const initItemView = (key) => {
  board = history.state.board;
  item = history.state.item;
  token = key.token.data;

  onClose(board);

  displayItemTitle(item);
  displayItemDescription(item);
  displayItemType(item);
  displayItemStatus(item);
  displayItemParent(item);
  displayAssignedUser(item, board.authorizedUsers);
  displayImportance(item);
  displayDueDate(item);
  displayComments(item, board.authorizedUsers);

  onSaveCommentClick(board, item);
};

const onClose = (board) => {
  $("#close-icon").on("click", () => {
    window.history.pushState({board: board}, "", "/board-view");
    urlLocationHandler();
  })
}

const displayItemTitle = (item) => {
  document.getElementById("page-title-label").innerHTML = item.title;
}

const displayItemDescription = (item) => {
  let description = (item.description != null && item.description != "") ? item.description : "-";
  document.getElementById("description-div").innerHTML = description;
}

const displayItemType = (item) => {
  let type = (item.type != null && item.type != "") ? item.type : "-";
  document.getElementById("type-div").innerHTML = type;
}

const displayItemStatus = (item) => {
  document.getElementById("status-div").innerHTML = item.status;
}

const displayItemParent = (item) => {
  let parent = (item.parent != null) ? item.parent.title + " (#" + item.parent.id + ")" : "-";
  document.getElementById("parent-div").innerHTML = parent;
}

const displayAssignedUser = (item, authUsers) => {
  let email = getEmailById(item.assignedToId, authUsers);
  document.getElementById("assigned-user-div").innerHTML = (email == null) ? "-" : email;
}

const displayImportance = (item) => {
  let importance = (item.importance != null) ? item.importance : "-"
  document.getElementById("importance-div").innerHTML = importance;
}

const displayDueDate = (item) => {
  let dueDate = (item.dueDate != null) ? item.dueDate : "-"
  document.getElementById("due-date-div").innerHTML = dueDate;
}

const displayComments = (item, boardUsers) => {
  for (const comment of item.commentList) {
    $(`#comments-div`).append(commentHtml(comment, getEmailById(comment.userId, boardUsers)));
  }
}

const getEmailById = (userId, boardUsers) => {
  for (const authorizedUser of boardUsers) {
    if (authorizedUser.id == userId) {
      return authorizedUser.email;
    }
  }

  return null;
} 

const onSaveCommentClick = (board, item) => {
  $("#save-comment-btn").on("click", () => {
    let content = document.getElementById("insert-comment-input").value;
    let commentRequest = { itemId: item.id, content: content };

    document.getElementById("insert-comment-input").innerHTML = "";

    if (content.length > 0) {
      document.getElementById("item-view-alert").innerHTML = "";

      fetch(serverAddress + "/item/addComment", {
        method: "PATCH",
        body: JSON.stringify(commentRequest),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          boardId: board.id,
          action: "ADD_COMMENT"
        },
      }).then((response) => {
        return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message)});
      }).then((updatedBoard) => {
        if (updatedBoard != null) {
          console.log("comment was added successfully");
          displayUpdatedComments(item.id, updatedBoard.data);
          onClose(updatedBoard.data);
        }
      }).catch(error => {
        document.getElementById("item-view-alert").innerHTML = `${error}`;
      });
    } else {
      document.getElementById("item-view-alert").innerHTML = "Comment cannot be empty";
    }
  })
}

const displayUpdatedComments = (itemId, board) => {
  document.getElementById("comments-div").innerHTML = "";

  for (const [status, items] of Object.entries(board.items)) {
    for (const item of items) {
      if (item.id == itemId) {
        displayComments(item, board.authorizedUsers);
      }
    }
  }
}

const commentHtml = (comment, userEmail) => {
  return `<div id="${comment.id}" class="col-3">
  📝
  <span><b>${userEmail}</b>  ${comment.timestamp} </span></br>
  ${comment.content} </br>
  </div>`;
};

export { initItemView };
