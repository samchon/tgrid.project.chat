import React from "react";
import ReactDOM from "react-dom";
import { Panel, Button, Glyphicon } from "react-bootstrap";

import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";

import { IChatService } from "../controllers/IChatService";
import { ChatPrinter } from "../providers/ChatPrinter";
import { ChatMovie } from "./ChatMovie";

export class JoinMovie extends React.Component<JoinMovie.IProps>
{
    //----------------------------------------------------------------
    //  CONSTRUCTOR
    //----------------------------------------------------------------
    public componentDidMount()
    {
        let input: HTMLInputElement = document.getElementById("name_input") as HTMLInputElement;
        input.select();
    }

    //----------------------------------------------------------------
    //  EVENT HANDLERS
    //----------------------------------------------------------------
    private _Handle_keyUp(event: React.KeyboardEvent): void
    {
        if (event.keyCode === 13)
            this._Participate();
    }

    private async _Participate(): Promise<void>
    {
        let input: HTMLInputElement = document.getElementById("name_input") as HTMLInputElement;
        let name: string = input.value;

        if (name === "")
        {
            alert("Name cannot be empty");
            return;
        }
        
        let connector: WebConnector = this.props.connector;
        let service: Driver<IChatService> = connector.getDriver<IChatService>();
        let participants: string[] | false = await service.setName(name);
        
        if (participants === false)
        {
            alert("Duplicated name");
            return;
        }

        let printer: ChatPrinter = new ChatPrinter(name, participants);
        connector.setProvider(printer);

        ReactDOM.render(<ChatMovie service={service} printer={printer} />, document.body);
    }

    //----------------------------------------------------------------
    //  RENDERER
    //----------------------------------------------------------------
    public render(): JSX.Element
    {
        return <Panel>
            <Panel.Heading>
                <Panel.Title> 
                    <Glyphicon glyph="list" />
                    {" "}
                    Chat Application 
                </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                Insert your name: 
                <input id="name_input" 
                       type="text" 
                       onKeyUp={this._Handle_keyUp.bind(this)}
                       />
            </Panel.Body>
            <Panel.Footer>
                <Button bsStyle="primary"
                        onClick={this._Participate.bind(this)}> 
                    <Glyphicon glyph="share-alt" />
                    {" "}
                    Participate in
                </Button>
            </Panel.Footer>
        </Panel>
    }
}
namespace JoinMovie
{
    export interface IProps
    {
        connector: WebConnector;
    }
}