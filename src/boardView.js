import $ from "jquery";

import {urlLocationHandler} from "./router";
import { serverAddress } from "./constants";

const initBoardView = async (key) => {
let board = history.state.board;

$("#board-title").html(board.title)

var li = document.createElement("li");
li.appendChild(statusTextNode);
statusesList.push(status);
document.getElementById("statuses-table").appendChild(li);

//   await fetch(serverAddress + "/user/getBoards", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: key.token.data,
//     },
//   })
//     .then((response) => {
//       return response.status == 200 ? response.json() : null;
//     })
//     .then((boards) => {
//       console.log(boards.data)

//       if (boards != null) {
//         for (const board of boards.data) {
//           $("#content").append(BoardHtml(board));
//           console.log(board);

//             // we add listeners for each button dynamically
//             $(`#open-${board.id}`).on("click", async () => {
//               window.history.pushState({ fid: board.id, title: board.name }, "", `/archive`);
//               urlLocationHandler();
//             });

//             $(`#delete-${board.id}`).on("click", async () => {

//             fetch(serverAddress + "/board/delete", {
//               method: "DELETE",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: key.token.data,
//                 boardId: board.id,
//               },
//             }).then(() => {
//               $(`#${board.id}`).html("");
//               initArchive(key)
//             })
//           });
       


//         }}

// })
}
      


export {initBoardView};

