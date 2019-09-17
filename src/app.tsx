import React from "react";
import ReactDOM from "react-dom";
import { Panel, Button } from "react-bootstrap";

import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";

import { IChatService } from "./controllers/IChatService";
import { ChatPrinter } from "./providers/ChatPrinter";
import { ChatMovie } from "./movies/ChatMovie";

class ChatApplication extends React.Component<ChatApplication.IProps>
{
    private async _Go_participate(): Promise<void>
    {
        let input: HTMLInputElement = document.getElementById("name_input") as HTMLInputElement;
        let name: string = input.value;
        
        let connector: WebConnector = this.props.connector;
        let service: Driver<IChatService> = connector.getDriver<IChatService>();
        let participants: string[] | false = await service.setName(name);
        
        if (participants === false)
        {
            alert("Duplicated name");
            return;
        }

        let printer: ChatPrinter = new ChatPrinter(name, participants);
        connector.provider = printer;

        ReactDOM.render(<ChatMovie service={service} printer={printer} />, document.body);
    }

    public render(): JSX.Element
    {
        return <Panel>
            <Panel.Heading>
                <Panel.Title> Particiate in Chat Application </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                Insert your name: <input id="name_input" type="text"></input>
            </Panel.Body>
            <Panel.Footer>
                <Button bsStyle="primary"
                        onClick={this._Go_participate.bind(this)}> 
                    Participate 
                </Button>
            </Panel.Footer>
        </Panel>
    }

    public static async main(): Promise<void>
    {
        let connector: WebConnector = new WebConnector();
        await connector.connect(`ws://${window.location.hostname}:10103`);

        ReactDOM.render
        (
            <ChatApplication connector={connector} />, 
            document.body
        );
    }
}
namespace ChatApplication
{
    export interface IProps
    {
        connector: WebConnector;
    }
}
window.onload = ChatApplication.main;