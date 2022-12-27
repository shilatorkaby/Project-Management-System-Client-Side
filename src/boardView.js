import $ from "jquery";

import { urlLocationHandler } from "./router";
import { serverAddress } from "./constants";

let token;

const initBoardView = async (key) => {
    let board = history.state.board;
    token = key.token.data;

    localStorage.setItem("boardId", board.id);
    localStorage.setItem("token", token);

    $("#exit-icon").on("click", () => {
        window.history.pushState({}, "", "/archive");
        urlLocationHandler();
    })

    loadBoard(board);
}

const loadBoard = (boardToDisplay) => {
    if (localStorage.getItem("boardId") != null && boardToDisplay.id == localStorage.getItem("boardId")) {
        console.log(boardToDisplay);
    
        displayBoardTitle(boardToDisplay);
        displayItems(boardToDisplay);
    
        onClickSettingBoardButton(boardToDisplay);
        onClickFilterBoardButton(boardToDisplay);
    }
}

const onClickFilterBoardButton = (board) => {
    $(`#filter-setting-btn`).on("click", async () => {
        window.history.pushState({ board: board }, "", "/filter-setting");
        urlLocationHandler();
    })
}

const displayBoardTitle = (boardToDisplay) => {
    $("#board-title").html(boardToDisplay.title);
}

const displayItems = (boardToDisplay) => {
    $("#items-div").empty();

    if (boardToDisplay.items != null) {
        for (const [status, items] of Object.entries(boardToDisplay.items)) {
            let validStatusString = status.replace(' ', '-')

            $("#items-div").append(StatusHtml(validStatusString));

            for (const item of items) {
                if (item.type == null) { item.type = "none" }
                $(`#div-${validStatusString}`).append(ItemHtml(item));

                $(`#open-${item.id}`).on("click", async () => {
                    window.history.pushState({ board: boardToDisplay, item: item }, "", "/item-view");
                    urlLocationHandler();
                })
                $(`#edit-${item.id}`).on("click", async () => {
                    window.history.pushState({ board: boardToDisplay, item: item }, "", "/edit-item");
                    urlLocationHandler();
                })
                $(`#delete-${item.id}`).on("click", async () => {
                    onClickDeleteItemButton(item, boardToDisplay);
                })
            }

            onClickDeleteStatus(validStatusString, boardToDisplay);
            onClickCreateItem(validStatusString, boardToDisplay);

        }
    }
}

const onClickDeleteItemButton = async (item, board) => {
    fetch(serverAddress + "/item/removeItem?itemId=" + item.id, {
        method: "DELETE",
        headers: {
            Authorization: token,
            boardId: board.id
        },
    }).then((response) => {
        return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message) });
    }).then((updatedBoard) => {
        if (updatedBoard != null) {
            console.log("item was successfully deleted");
        }
    }).catch(error => {
        alert(`Error: ${error}`);
    });
}

const onClickSettingBoardButton = async (boardToDisplay) => {
    $(`#board-setting-btn`).on("click", async () => {
        console.log("move to board setting");
        window.history.pushState({ board: boardToDisplay }, "", "/board-setting");
        urlLocationHandler();
    })

}

const onClickDeleteStatus = (status, boardToDisplay) => {
    let validStatusString = status.replace('-', ' ')

    $(`#delete-${status}`).on("click", async () => {
        fetch(serverAddress + "/board/removeStatus?status=" + validStatusString, {
            method: "DELETE",
            headers: {
                Authorization: token,
                boardId: boardToDisplay.id
            },
        }).then((response) => {
            return response.status == 200 ? response.json() : null;
        }).then((updatedBoard) => {
            if (updatedBoard != null) {
                console.log("update value:")
                console.log(updatedBoard);
                $(`#div-${status}`).html("");
            }
        })
    });
}

const onClickCreateItem = (status, boardToDisplay) => {
    $(`#add-item-${status}`).on("click", () => {
        window.history.pushState({ status, board: boardToDisplay }, "", "/create-item");
        urlLocationHandler();
    })
}

const StatusHtml = (status) => {
    return `<div id="div-${status}" class="col-3">
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
              <span><button id="open-${item.id}" class="btn btn-success btn-board-view" style = "background:rgb(76, 183, 163); width: 75px">Open</button>
              <button id="edit-${item.id}" class="btn btn-success btn-board-view" style = "background:rgb(76, 183, 163); width: 75px">Edit</button>
              <button id="delete-${item.id}" class="btn btn-danger btn-board-view" >Delete</button></span>
          </div>`;
};

export { initBoardView, loadBoard };
