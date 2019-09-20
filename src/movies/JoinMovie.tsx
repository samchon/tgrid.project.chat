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
        const TGRID = "https://tgrid.dev";
        const GITHUB = "https://github.com/samchon/tgrid.projects.chat-application";
        const GUIDE_EN = "https://tgrid.dev/english/tutorial/projects/chat-application.html";
        const GUIDE_KR = "https://tgrid.dev/korean/tutorial/projects/chat-application.html";

        return <Panel>
            <Panel.Heading>
                <Panel.Title> 
                    <Glyphicon glyph="list" />
                    {" Chat Application "}
                </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <h1> Chat Application </h1>
                <p> Demo Project of {this._Render_link(TGRID, "TGrid")} </p>
                <ul>
                    <li> {this._Render_link(GITHUB, "Github Repository")} </li>
                    <li> Guide Documents </li>
                    <ul>
                        <li> {this._Render_link(GUIDE_EN, "English")} </li>
                        <li> {this._Render_link(GUIDE_KR, "한국어")} </li>
                    </ul>
                </ul>
                <p>
                    Insert your name: 
                    <input id="name_input" 
                        type="text" 
                        onKeyUp={this._Handle_keyUp.bind(this)} />
                </p>
            </Panel.Body>
            <Panel.Footer>
                <Button bsStyle="primary"
                        onClick={this._Participate.bind(this)}> 
                    <Glyphicon glyph="share-alt" />
                    {" Participate in"}
                </Button>
            </Panel.Footer>
        </Panel>
    }
    
    private _Render_link(url: string, text: string): JSX.Element
    {
        return <a href={url} target="_blank">{text}</a>;
    }
}
namespace JoinMovie
{
    export interface IProps
    {
        connector: WebConnector;
    }
}