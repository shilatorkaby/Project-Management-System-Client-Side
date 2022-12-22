import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { serverAddress } from "./constants";


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
    // stompClient.send("/app/hello", [], JSON.stringify({ name: "Default user" }));
    stompClient.subscribe("/topic/updates", onBoardResponseReceived);
}

const onBoardResponseReceived = (payload) => {
    console.log("on onBoardResponseReceived");

    var message = JSON.parse(payload.body);
    console.log(message);
};


export { join };
