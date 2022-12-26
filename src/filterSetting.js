
import $ from "jquery";

import { Buffer } from 'buffer';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";

let board;
let token;
const initFilterSettings = async (key) => {

    board = history.state.board;
    token = key.token.data;
    console.log(board);



    displayStatusesList(board)
    onClickCloseBtn()
    onClickFilterBtn()
}


let criteriaNames = ["Assign to", "Due date", "Status", "Type", "Importance"]
const displayStatusesList = (boardToDisplay) => {

    for (let name of criteriaNames) {
        console.log(name);
        // $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

        switch (name) {
            case "Assign to": {
                if (boardToDisplay.authorizedUsers.length > 0) {
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                for (let user of boardToDisplay.authorizedUsers) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, user.email));
                    console.log(status);
                }
                break;
            }
            case "Due date": {
                $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));
                $(`#filter-criteria`).append(dueDateHtml());
                break;
            }
            case "Status": {
                if (boardToDisplay.statuses.length > 0) {
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                for (let status of boardToDisplay.statuses) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, status));
                    console.log(status);
                }
                break;
            }
            case "Type": {
                if (boardToDisplay.types.length > 0) {
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                for (let type of boardToDisplay.types) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, type));
                    console.log(type);
                }
                break;
            }
            case "Importance": {
                $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                for (let importance of [1, 2, 3, 4, 5]) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, importance));
                    console.log(importance);
                }
            }
        }

    }

}


const onClickCloseBtn = () => {
    $("#close-icon").on("click", () => {
        window.history.pushState({ board: board }, "", "/board-view");
        urlLocationHandler();
    });
}
const onClickFilterBtn = () => {
    $(`#filter-btn`).on("click", async () => {

        fetch(serverAddress + "/board/filter", {
            method: "POST",
            body: JSON.stringify({ status: ["status"] }),
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                boardId: board.id
            },
        }).then((response) => {
            return response.status == 200 ? response.json() : null;
        }).then((updatedBoard) => {
            if (updatedBoard != null) {
                console.log(updatedBoard);
            }
        })
    });
}

const filterCriteriaOptionsHtml = (CriteriaName, option) => {
    return `<div style = "display: flex;">
   <input type="checkbox" class = "filter-input" id="in-app-checkbox" name="in-app-checkbox" value="In app">
    <label for="in-app-checkbox" id="${CriteriaName}-${option}-option"> ${option}</label>
    <\div>
`
}
const dueDateHtml = () => {
    return `<input type="date" id="due-date-option" name="due-date" value="" min="2023-01-01" max="2024-01-01"  onfocus="this.min=new Date().toISOString().split('T')[0]; 
   this.max=new Date(new Date().setFullYear(new Date().getFullYear()+1)).toISOString().split('T')[0]">

`
}

const filterCriteriaLabelHtml = (CriteriaName) => {
    return `<h3 id="${CriteriaName}" > ${CriteriaName}:</h3>`;
}

export { initFilterSettings }
