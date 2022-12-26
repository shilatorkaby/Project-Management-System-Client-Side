import $ from "jquery";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import { openConnection } from "./sockets";


const initArchive = async (key) => {
  console.log(key.token.data);

  await fetch(serverAddress + "/board/getBoardsByUserId", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: key.token.data
    },
  })
    .then((response) => {
      return response.status == 200 ? response.json() : null;
    })
    .then((boards) => {
      console.log(boards.data)

      if (boards != null) {
        for (const board of boards.data) {
          openConnection(boards.data);

          $("#content").append(BoardHtml(board));
          console.log(board);

          // we add listeners for each button dynamically
          $(`#open-${board.id}`).on("click", async () => {
            window.history.pushState({ board: board }, "", `/board-view`);
            urlLocationHandler();
          });

          $(`#delete-${board.id}`).on("click", async () => {

            fetch(serverAddress + "/board/delete", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: key.token.data,
                boardId: board.id,
              },
            }).then(() => {
              $(`#${board.id}`).html("");

            })
          });
        }
      }
    })

  $("#create-board").on("click", () => {
    console.log("create board btn clicked");
    window.history.pushState({}, "", "/create-board");
    urlLocationHandler();
  })

  $("#notification-preferences").on("click", () => {
    console.log("notification-preferences btn clicked");
    window.history.pushState({}, "", "/notifications-settings");
    urlLocationHandler();
  })
};

const BoardHtml = (board) => {
  return `<div id="${board.id}" class="col-3">
  <p></p>
  <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path fill="currentColor" d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9.883l-1 1.01V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4.085c.071.2.185.389.344.55l.441.45H6a2 2 0 0 1-2-2V4Zm4 1.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0ZM9.5 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4Zm0 4a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4ZM9 13.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm-2-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm10.855.352a.5.5 0 0 0-.71-.704l-3.643 3.68l-1.645-1.678a.5.5 0 1 0-.714.7l1.929 1.968a.6.6 0 0 0 .855.002l3.928-3.968Z"/></svg>            <b>Title</b>: ${board.title} </br>
            <button id="open-${board.id}" class="btn btn-success" style = "background:rgb(45, 75, 130)"> Open</button>
            <button id="delete-${board.id}" class="btn btn-danger" >Delete</button>
        </div>`;
};

export { initArchive };
