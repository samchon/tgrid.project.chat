import React from "react";
import ReactDOM from "react-dom";

import { WebConnector } from "tgrid/protocols/web/WebConnector";

import { JoinMovie } from "./movies/JoinMovie";

window.onload = async function ()
{
    let connector: WebConnector = new WebConnector();
    await connector.connect(`ws://${window.location.hostname}:10103`);

    ReactDOM.render
    (
        <JoinMovie connector={connector} />, 
        document.body
    );
}