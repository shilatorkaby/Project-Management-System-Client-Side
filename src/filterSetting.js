
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

const filterRequest = new Map();
let criteriaNames = ["Assign to", "Due date", "Status", "Type", "Importance"]
const displayStatusesList = (boardToDisplay) => {

    for (let name of criteriaNames) {
        switch (name) {
            case "Assign to": {
                if (boardToDisplay.authorizedUsers.length > 0) {
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));
                    filterRequest.set(name, []);

                }
                for (let user of boardToDisplay.authorizedUsers) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, user.email));
                    filterRequest.get(name).push(`${name}-${user.email}-option`)
                }
                break;
            }
            case "Due date": {
                $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));
                $(`#filter-criteria`).append(dueDateHtml());
                filterRequest.set(name, "due-date-option");
                break;
            }
            case "Status": {
                if (boardToDisplay.statuses.length > 0) {
                    filterRequest.set(name, []);
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                for (let status of boardToDisplay.statuses) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, status));
                    console.log(`${name}-${status}-option`);
                    filterRequest.get(name).push(`${name}-${status}-option`);
                }
                break;
            }
            case "Type": {
                if (boardToDisplay.types.length > 0) {
                    filterRequest.set(name, []);
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                for (let type of boardToDisplay.types) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, type));
                    filterRequest.get(name).push(`${name}-${type}-option`)
                }
                break;
            }
            case "Importance": {
                filterRequest.set(name, []);
                $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                for (let importance of [1, 2, 3, 4, 5]) {
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name, importance));
                    filterRequest.get(name).push(`${name}-${importance}-option`)
                }
            }
        }

    }
    console.log("init map");
    console.log(filterRequest);
}


const onClickCloseBtn = () => {
    $("#close-icon").on("click", () => {
        window.history.pushState({ board: board }, "", "/board-view");
        urlLocationHandler();
    });
}
const createFilterRequest = () => {

    console.log("on createFilterRequest method");

    for (let [criteriaName, values] of filterRequest.entries()) {
        if (criteriaName == "Due date") {
            filterRequest.set("Due date",$("#due-date-option").val())
        } else {
            for (let check of values) {
                if(!document.getElementById(check).checked){
                    filterRequest.set(criteriaName,filterRequest.get(criteriaName).filter(option => option !=check));
                }else {
                    filterRequest.set(criteriaName,filterRequest.get(criteriaName).filter(option => option !=check));
                    filterRequest.get(criteriaName).push(document.getElementById(check).value);

                }
            }
        }
    }

}


const onClickFilterBtn = () => {

    $(`#filter-btn`).on("click", async () => {
        createFilterRequest()
        console.log(filterRequest.get("Assign to"));


        fetch(serverAddress + "/board/filter", {
            method: "POST",
            body: JSON.stringify({assignedToId: filterRequest.get("Assign to"),dueDate: filterRequest.get("Due Date") , status: filterRequest.get("Status"), type: filterRequest.get("Type"),importance: filterRequest.get("Importance") }),
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
   <input type="checkbox" class = "filter-input" id="${CriteriaName}-${option}-option" name="in-app-checkbox" value="${option}">
    <label for="in-app-checkbox" id="${CriteriaName}-${option}-label"> ${option}</label>
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
