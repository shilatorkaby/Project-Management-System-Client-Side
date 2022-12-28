import $ from "jquery";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import { validateTitle, titleConstraint } from "./validations";

let boardId;
let token;
let board;

const initBoardSetting = async (key) => {
    console.log("arrived to board setting");

    boardId = history.state.board.id;
    token = key.token.data;
    board = history.state.board;

    displayTypesList(board);

    $("#close-icon").on("click", () => {
        window.history.pushState({ board: board }, "", "/board-view");
        urlLocationHandler();
    })

    $("#changes-title-btn").on("click", function () {
        document.getElementById("board-settings-alert").innerHTML = "";
        console.log("change title btn clicked");
        let boardTitle = document.getElementById("set-title-input").value;        
        changeTitle(boardTitle);        
    });

    $("#add-status-btn").on("click", function () {        
        console.log("status btn clicked");
        const status = document.getElementById("status-input-to-add").value;        
        addStatuses(status);
    });

    $("#add-type-btn").on("click", function () {
        const type = document.getElementById("type-input-to-add").value;        
        addTypes(type);       
    });

    $("#remove-type-btn").on("click", function () {
        let type = $("#type-to-remove-select :selected").text();
        removeTypes(type);
    });

    $("#assign-user-btn").on("click", function () {
        let assignUserEmail = document.getElementById(`assign-user-email`).value
        console.log(assignUserEmail);
        let assignUserRole = $("#assign-user-role :selected").val();
        console.log(assignUserRole);

        if (assignUserEmail != null && assignUserRole != null) {
            fetch(serverAddress + "/board/grantUserRole", {
                method: "PATCH",
                body: JSON.stringify({ boardId: boardId, email: assignUserEmail, role: assignUserRole }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                    boardId: boardId,
                },
            }).then((response) => {
                return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message) });
            }).then((updatedBoard) => {
                if (updatedBoard != null) {
                    console.log("update value:")
                    console.log(updatedBoard);
                    board = updatedBoard.data;

                    document.getElementById("board-settings-confirm").innerHTML = "User was assigned successfully";
                
                    $("#close-icon").on("click", () => {
                        window.history.pushState({ board: board }, "", "/board-view");
                        urlLocationHandler();
                    })
                }
            }).catch(error => {
                document.getElementById("board-settings-alert").innerHTML = `${error}`;
            });
        }
    });
}

const displayTypesList = (boardToDisplay) => {
    var typesSelect = document.getElementById('type-to-remove-select')
    let index = 0;

    $("#type-to-remove-select").empty();

    for (const type of boardToDisplay.types) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.text = type;
        typesSelect.appendChild(opt);
        index += 1;
    }
}

const changeTitle = (title) => {
    console.log("change title to " + title);
    updateValue(title, "title")
}

const addTypes = (type) => {
    updateValue(type, "addType")
    console.log("new type added: " + type);
};

const removeTypes = (type) => {
    console.log("remove type: " + type);
    updateValue(type, "removeType")
};

const addStatuses = (status) => {
    console.log("add status: " + status);
    updateValue(status, "addStatus")
};

const updateValue = (value, path) => {
    console.log(value);

    if (value != null && validateTitle(value)) {
        fetch(serverAddress + "/board/" + path + "?value=" + value, {
            method: "PATCH",
            headers: {
                Authorization: token,
                boardId: boardId,
            },
        }).then((response) => {
            return response.ok ? response.json() : response.json().then(res => { throw new Error(res.message) });
        }).then((updatedBoard) => {
            if (updatedBoard != null) {
                console.log("update value:")
                console.log(updatedBoard.data);
                board = updatedBoard.data;

                document.getElementById("board-settings-confirm").innerHTML = "The operation was carried out successfully";
                
                $("#close-icon").on("click", () => {
                    window.history.pushState({ board: board }, "", "/board-view");
                    urlLocationHandler();
                })
            }
        }).catch(error => {
            document.getElementById("board-settings-alert").innerHTML = `${error}`;
        });
    } else {        
        document.getElementById("board-settings-alert").innerHTML = titleConstraint("Board, type or status ");
        console.log("Invalid input");        
    }
}

export { initBoardSetting }