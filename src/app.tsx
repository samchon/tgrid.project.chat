import React from "react";
import ReactDOM from "react-dom";
import { Modal, Button } from "react-bootstrap";

import { WebConnector } from "tgrid/protocols/web";
import { Driver } from "tgrid/components/Driver";

import { IChatService } from "./controllers/IChatService";
import { ChatPrinter } from "./providers/ChatPrinter";

class ChatApplication extends React.Component<ChatApplication.IProps>
{
    private async _Handle_login(): Promise<void>
    {
        let input: HTMLInputElement = document.getElementById("name_input") as HTMLInputElement;
        let name: string = input.value;

        let service: Driver<IChatService> = this.props.service;
        let participants: string[] | false = await service.setName(name);
        
        if (participants === false)
        {
            alert("Duplicated name");
            return;
        }


    }

    public render(): JSX.Element
    {
        return <Modal>
            <Modal.Header>
                <Modal.Title> Particiate in Chat Application </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Insert your name: <input id="name_input" type="text"></input>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary"> Participate </Button>
            </Modal.Footer>
        </Modal>
    }

    public static async main(): Promise<void>
    {
        let connector: WebConnector = new WebConnector();
        await connector.connect(`ws://${window.location.host}:10103`);

        let service: Driver<IChatService> = connector.getDriver();

        ReactDOM.render
        (
            <ChatApplication connector={connector} 
                             service={service} />, 
            document.body
        );
    }
}
namespace ChatApplication
{
    export interface IProps
    {
        connector: WebConnector;
        service: Driver<IChatService>;
    }
}
window.onload = ChatApplication.main;