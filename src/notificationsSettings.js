import $ from "jquery";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";

let token;

const initNotificationsSettings = async (key) => {
    console.log("arrived to notifications settings");

    token = key.token.data;

    $("#close-icon").on("click", () => {
        window.history.pushState({}, "", "/archive");
        urlLocationHandler();
    })

    $("#submit-notifications-btn").on("click", function () {
        console.log("submit-notifications-btn clicked");

        var notifyByEmail = document.getElementById("email-checkbox").checked;
        var notifyByPopUp = document.getElementById("in-app-checkbox").checked;

        var notifyWhenItemAssignedToMe = document.getElementById("notification1-checkbox").checked;
        var notifyWhenItemStatusChanged = document.getElementById("notification2-checkbox").checked;
        var notifyWhenCommentAdded = document.getElementById("notification3-checkbox").checked;
        var notifyWhenItemDeleted = document.getElementById("notification4-checkbox").checked;
        var notifyWhenItemDataChenged = document.getElementById("notification5-checkbox").checked;
        var notifyWhenUserAdded = document.getElementById("notification6-checkbox").checked;

        const notifyVia = [];
        if (notifyByEmail == true) {
            notifyVia.push("EMAIL");
        }
        if (notifyByPopUp == true) {
            notifyVia.push("POP_UP");
        }

        const notifyWhen = [];
        if (notifyWhenItemAssignedToMe == true) {
            notifyWhen.push(document.getElementById("notification1-checkbox").value);
        }
        if (notifyWhenItemStatusChanged == true) {
            notifyWhen.push(document.getElementById("notification2-checkbox").value);
        }
        if (notifyWhenCommentAdded == true) {
            notifyWhen.push(document.getElementById("notification3-checkbox").value);
        }
        if (notifyWhenItemDeleted == true) {
            notifyWhen.push(document.getElementById("notification4-checkbox").value);
        }
        if (notifyWhenItemDataChenged == true) {
            notifyWhen.push("SET_ITEM_DUE_DATE");
            notifyWhen.push("SET_ITEM_IMPORTANCE");
            notifyWhen.push("SET_ITEM_TITLE");
            notifyWhen.push("SET_ITEM_DESCRIPTION");
            notifyWhen.push("SET_ITEM_PARENT");
            notifyWhen.push("SET_ITEM_TYPE");
        }
        if (notifyWhenUserAdded == true) {
            notifyWhen.push(document.getElementById("notification6-checkbox").value);
        }

        setNotificationsPreferences(notifyVia, notifyWhen);

        window.history.pushState({}, "", "/archive");
        urlLocationHandler();
    });
}

const setNotificationsPreferences = (notifyVia, notifyWhen) => {
    console.log(notifyVia, notifyWhen);

    fetch(serverAddress + "/user/setNotificationPreferences", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            boardActions: notifyWhen,
            notificationViaList: notifyVia,
        }),
    }).then((response) => {
        return response.status <= 204 ? response.json() : null;
    })
}

export { initNotificationsSettings }