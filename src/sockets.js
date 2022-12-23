import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { serverAddress } from "./constants";
import { loadBoard } from "./boardView";


var stompClient;

const socketFactory = () => {
  return new SockJS(serverAddress + "/ws");
};

const join = () => {
    openConnection();
};

const openConnection = () => {
    console.log("on openConnection");

    const socket = socketFactory();
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onJoined);
};

const onJoined = () => {
    stompClient.subscribe("/topic/updates", onBoardResponseReceived);
}

const onBoardResponseReceived = (payload) => {
    console.log("on onBoardResponseReceived");

    var message = JSON.parse(payload.body);
    console.log(message);

    loadBoard(message);
};


export { join };
