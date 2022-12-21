import $ from "jquery";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";


let boardId;
let token;
const initBoardSetting = async (key) => {

    boardId = history.state.board.id;
    token = key.token.data;
    
    $("#close-icon").on("click", ()=>{
        window.history.pushState({board: history.state.board}, "", "/board-view");
        urlLocationHandler();
    })

    $("#change-title-btn").on("click", function () {
        console.log("change title btn clicked");
        // console.log("title: "+document.getElementById("set-title-input").value);
       
        changeTitle(document.getElementById("set-title-input").value);
        // console.log("change board's title to ");
    }); 
    
    $("#add-status-btn").on("click", function () {
        console.log("status btn clicked");
        const status = document.getElementById("status-input-to-add").value;
        addStatuses(status);
        
    });

    $("#add-type-btn").on("click", function () {
        const type = document.getElementById("type-input-to-add").value;
        if (type.length > 0) {
            addTypes(type);
        }
    });

    $("#remove-type-btn").on("click", function () {
        const type = document.getElementById("type-input-to-remove").value;
        removeTypes(type);
        
    });

    $("#assign-user-btn").on("click", function () {
        let assignUserEmail = document.getElementById(`assign-user-email`).value
        let assignUserRole = document.getElementById(`assign-user-role`).value
        
        if (assignUserEmail != null && assignUserRole != null) {
            fetch(serverAddress + "/board/grantUserRole", {
                method: "PATCH",
                body: JSON.stringify({boardId:boardId, emailOfAssignedUser:assignUserEmail , role:assignUserRole}) ,
                headers: {
                    "Content-Type": "text/plain",
                    Authorization: token,
                    boardId: boardId,
                },
            }).then((response) => {
                return response.status == 200 ? response.json() : null;
            })
        }

        console.log("assignUserEmail " + assignUserEmail + " " + "assignUserRole " + assignUserRole);
    });  
    
}

const changeTitle = (title) => {
    console.log("change title to "+title);
    updateValue(title,"title")

}



const addTypes = (type) => {

    updateValue(type,"addType")
  
    console.log("new type added: " + type);
};

const removeTypes = (type) => {

    console.log("remove type: " + type);
    updateValue(type,"removeType")
};

const addStatuses = (status) => {

    console.log("add status: " + status);
    updateValue(status,"addStatus")
};


const updateValue = (value,path) =>{
    console.log(value);
    if (value != null) {
        fetch(serverAddress + "/board/"+path+"?value="+value, {
            method: "PATCH",
            headers: {
                "Content-Type": "text/plain",
                Authorization: token,
                boardId: boardId,
            },
        }).then((response) => {
            return response.status == 200 ? response.json() : null;
        })
    }
}

export { initBoardSetting }