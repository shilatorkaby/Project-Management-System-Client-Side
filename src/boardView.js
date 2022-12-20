import $ from "jquery";

// import {urlLocationHandler} from "./router";
// import { serverAddress } from "./constants";

const initBoardView = async (key) => {
let board = history.state.board;

$("#board-title").html(board.title)

var li = document.createElement("li");
li.appendChild(statusTextNode);
statusesList.push(status);
document.getElementById("statuses-table").appendChild(li);

}
      
export {initBoardView};

