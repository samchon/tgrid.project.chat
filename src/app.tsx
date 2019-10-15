import "core-js";
import React from "react";
import ReactDOM from "react-dom";

import { WebConnector } from "tgrid/protocols/web/WebConnector";

import { Global } from "./Global";
import { JoinMovie } from "./movies/JoinMovie";

window.onload = async function ()
{
    let connector: WebConnector = new WebConnector();
    await connector.connect(`ws://${window.location.hostname}:${Global.PORT}`);

    ReactDOM.render
    (
        <JoinMovie connector={connector} />, 
        document.body
    );
}