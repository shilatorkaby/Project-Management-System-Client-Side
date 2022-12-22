import $ from "jquery";

import {urlLocationHandler} from "./router";
import { serverAddress } from "./constants";
import { join } from "./sockets";

// let board;
let token;

const initBoardView = async (key) => {
    let board = history.state.board;
    token = key.token.data;
    console.log("init - befot load board");
    loadBoard(board);

    join();
}

const loadBoard = (boardToDisplay) => {
    console.log(boardToDisplay);
    // console.log("boardToDisplay: "+ boardToDisplay);

    displayBoardTitle(boardToDisplay);
    displayStatusesList(boardToDisplay);
    displayTypesList(boardToDisplay);
    displayItems(boardToDisplay);

    onClickEditBoardButton(boardToDisplay);
}

const displayBoardTitle = (boardToDisplay) => {
    $("#board-title").html(boardToDisplay.title);
}

const displayStatusesList = (boardToDisplay) => {
    var statusesSelect = document.getElementById('statuses-select')
    let index = 0;

    console.log(boardToDisplay.statuses);

    for (const status of boardToDisplay.statuses) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.text = status;
        statusesSelect.appendChild(opt);
        index += 1;
    }
}


const displayTypesList = (boardToDisplay) => {
    var typesSelect = document.getElementById('types-select')
    let index = 0;

    $("#types-select").html("");

    for (const type of boardToDisplay.types) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.text = type;
        typesSelect.appendChild(opt);
        index += 1;
    }
}

const displayItems = (boardToDisplay) => {
    $("#items-div").html("");

    if (boardToDisplay.items != null) {
        for (const [status, items] of Object.entries(boardToDisplay.items)) {
            $("#items-div").append(StatusHtml(status));
            for (const item of items) {
                $(`#div-${status.title}`).append(ItemHtml(item));
            }

            onClickDeleteStatus(status, boardToDisplay);
        }
    }
}

const onClickEditBoardButton = async (boardToDisplay) => {
    $(`#edit-board-btn`).on("click", async () => {
        console.log("move to board setting");
        window.history.pushState({board : boardToDisplay}, "", "/board-setting");
        urlLocationHandler();
      })

}

const onClickDeleteStatus = (status, boardToDisplay) => {
    $(`#delete-${status}`).on("click", async () => {
        fetch(serverAddress + "/board/removeStatus", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                boardId: boardToDisplay.id
            },
        }).then(() => {
            $(`#${status}`).html("");
        })
    });
}

const StatusHtml = (status) => {
    return `<div id="div-${status.title}" class="col-3">
    <p></p>
    
    <svg width="12px" height="12px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
  <circle cx="6" cy="6" r="5" fill-rule="evenodd" stroke="#000"/>
</svg>
    ${status} </br>
    <span><button id="add-item-${status}" class="btn btn-success btn-board-view" style = "background:rgb(45, 75, 130)"> Add item</button>      
    <button id="delete-${status}" class="btn btn-danger btn-board-view" >Delete</button></span>  
          </div>`;
};

const ItemHtml = (item) => {
    return `<div id="${item.id}" class="col-3">
    <p></p>
    <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g><path d="M7.93,8.24,5.26,5.58,4,6.85l3.94,3.94L16,2.7,14.74,1.43,13,3.17,11.2,5Zm3.27,4H2.8V3.8H11L12.75,2H1V14H13V7.13l-1.8,1.8Z"/></g></svg>            
    <b>Title</b>: ${item.title} </br>
    <b>Type:</b> ${item.type} </br>
    ${item.description} </br>
              <span><button id="open-${item.id}" class="btn btn-success btn-board-view" style = "background:rgb(45, 75, 130)"> Open</button>
              <button id="delete-${item.id}" class="btn btn-danger btn-board-view" >Delete</button></span>
          </div>`;
};

export { initBoardView, loadBoard };

