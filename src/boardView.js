import $ from "jquery";

// import {urlLocationHandler} from "./router";
import { serverAddress } from "./constants";
import { join } from "./sockets";

let board;
let token;

const initBoardView = async (key) => {
    board = history.state.board;
    token = key.token.data;

    loadBoard();
    join();
}

const loadBoard = () => {
    displayBoardTitle();
    displayStatusesList();
    displayTypesList();
    displayItems();

    onClickEditBoardButton();
}

const displayBoardTitle = () => {
    $("#board-title").html(board.title);
}

const displayStatusesList = () => {
    var statusesSelect = document.getElementById('statuses-select')
    let index = 0;

    $("#statuses-select").empty();

    for (const status of board.statuses) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.text = status;
        statusesSelect.appendChild(opt);
        index += 1;
    }
}

const displayTypesList = () => {
    var typesSelect = document.getElementById('types-select')
    let index = 0;

    $("#types-select").empty();

    for (const type of board.types) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.text = type;
        typesSelect.appendChild(opt);
        index += 1;
    }
}

const displayItems = () => {
    if (board.items != null) {
        for (const [status, items] of Object.entries(board.items)) {
            $("#items-div").append(StatusHtml(status));
            for (const item of items) {
                $(`#div-${status.title}`).append(ItemHtml(item));
            }

            onClickDeleteStatus(status);
        }
    }
}

const onClickEditBoardButton = async () => {
    $(`#edit-board-btn`).on("click", async () => {
        let newTitle = prompt("Please enter new title:", "New Title");
        let boardId = board.id;
        console.log(boardId)

        let urlRequest = serverAddress + "/board/title/?title=" + newTitle;
        await fetch(urlRequest, {
            method: "PATCH",
            headers: {
                Authorization: token,
                boardId: boardId
            }
        }).then((response) => {
            return response.status == 200 ? response.json() : null;
          }).then((board) => {
            console.log(board);
            loadBoard(board.data)
        });
    });
}

const onClickDeleteStatus = (status) => {
    $(`#delete-${status}`).on("click", async () => {
        fetch(serverAddress + "/board/removeStatus", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                boardId: board.id
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

