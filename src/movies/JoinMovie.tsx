import React from "react";
import ReactDOM from "react-dom";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import GitHubIcon from "@material-ui/icons/Github";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";

import { IChatService } from "../controllers/IChatService";
import { ChatPrinter } from "../providers/ChatPrinter";
import { ChatMovie } from "./ChatMovie";
import { Global } from "../Global";

export class JoinMovie extends React.Component<JoinMovie.IProps>
{
    private get name_input_(): HTMLInputElement
    {
        return document.getElementById("name_input") as HTMLInputElement;
    }

    /* ----------------------------------------------------------------
        EVENT HANDLERS
    ---------------------------------------------------------------- */
    public componentDidMount()
    {
        this.name_input_.select();
    }

    private _Open_link(url: string): void
    {
        window.open(url, "_blank");
    }

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

    /* ----------------------------------------------------------------
        RENDERER
    ---------------------------------------------------------------- */
    public render(): JSX.Element
    {
        return <React.Fragment>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6"> Chat Application </Typography>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton color="inherit" 
                                onClick={this._Open_link.bind(this, Global.BOOK)}>
                        <MenuBookIcon />
                    </IconButton>
                    <IconButton color="inherit"
                                onClick={this._Open_link.bind(this, Global.GITHUB)}>
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Container>
                <p> Insert your name: </p>
                <p>
                    <Input id="name_input" 
                           placeholder="Your Name"
                           onKeyUp={this._Handle_keyUp.bind(this)} /> 
                    {" "}
                    <Button color="primary" 
                            variant="outlined" 
                            onClick={this._Participate.bind(this)}> Enter </Button>
                </p>
            </Container>
        </React.Fragment>
    }

}
namespace JoinMovie
{
    export interface IProps
    {
        connector: WebConnector;
    }
}