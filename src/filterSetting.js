
import $ from "jquery";

import { Buffer } from 'buffer';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";

let board;
const initFilterSettings = async (key) => {
   
    board = history.state.board;
    console.log(board);

    
   
    displayStatusesList(board)
    onClickCloseBtn()
    onClickFilterBtn()
}


let criteriaNames = ["Creator","Assign to","Due to date","Parent Item","Status","Type","Importance"]
const displayStatusesList = (boardToDisplay) => {

    for (let name of criteriaNames) {
        console.log(name);
        // $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

        switch(name) {
            case "Creator":
              // code block
              break;
            case "Assign to":
              // code block
              break;  
            case "Due to date":
            // code block
            break;
            case "Parent Item":
              // code block
              break;  
            case "Status": {
                if (boardToDisplay.statuses.length > 0){
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                for (let status of boardToDisplay.statuses){
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name,status));
                    console.log(status);
                }
            }
            break;
            case "Type": {
                if (boardToDisplay.types.length > 0){
                    $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                }
                    for (let type of boardToDisplay.types){
                        $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name,type));
                        console.log(type);
                    }
                }
                break;
            case "Importance": {
                $(`#filter-criteria`).append(filterCriteriaLabelHtml(name));

                for (let importance of [1,2,3,4,5]){
                    $(`#filter-criteria`).append(filterCriteriaOptionsHtml(name,importance));
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
const onClickFilterBtn = () =>{
    $(`#filter-btn`).on("click", async () => {

        fetch(serverAddress + "/board/filter", {
            method: "POST",
            body : JSON.stringify({status : ["status"]}),
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                boardId: board.id
            },
        }).then((updatedBoard) => {
            if (updatedBoard != null) {
               loadBoard(updatedBoard);
            }
        })
    });
}

const filterCriteriaOptionsHtml = (CriteriaName,option) =>{
   return `<div style = "display: flex;">
   <input type="checkbox" class = "filter-input" id="in-app-checkbox" name="in-app-checkbox" value="In app">
    <label for="in-app-checkbox" id="option-${CriteriaName}-${option}"> ${option}</label>
    <\div>
`

}
const filterCriteriaLabelHtml = (CriteriaName) =>{
    return `<h3 id="${CriteriaName}" > ${CriteriaName}:</h3>`; 
}

export {initFilterSettings}
