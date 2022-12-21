import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { serverAddress } from "./constants";
import { loadBoard } from './boardView';


let stompClient;

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
    stompClient.subscribe("/topic/join", onBoardResponseReceived);
};

const onJoined = () => {
    let board = localStorage.getItem("board");
    let boardId = board.id;
    console.log(boardId);

    stompClient.send("/app/join", [], JSON.stringify({boardId}));
}

const onBoardResponseReceived = (payload) => {
    console.log("on onBoardResponseReceived");

    var message = JSON.parse(payload.body);
    console.log(message);

    let board = JSON.stringify(message.body.data);
    localStorage.setItem("board", board);

    loadBoard(board);
};


export { join };
