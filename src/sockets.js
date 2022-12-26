import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { serverAddress } from "./constants";
import { loadBoard } from "./boardView";
import { notify } from "./router";


var stompClient;

const socketFactory = () => {
  return new SockJS(serverAddress + "/ws");
};


const openConnection = (userBoards) => {
    console.log("on openConnection");

    const socket = socketFactory();
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => onConnected(userBoards));
};

const onConnected = (userBoards) => {
    for (const board of userBoards) {
        stompClient.subscribe(`/topic/notifications-${board.id}`, onNotificationResponseReceived);
        stompClient.subscribe(`/topic/updates-${board.id}`, onBoardResponseReceived);
    }
}

const onBoardResponseReceived = (payload) => {
    console.log("BoardResponse was received");

    var message = JSON.parse(payload.body);
    console.log(message);

    loadBoard(message);
};

const onNotificationResponseReceived = (payload) => {
    console.log("NotificationResponse was received");
    
    var message = JSON.parse(payload.body);
    console.log(message);

    notify(message);
}


export { openConnection };
