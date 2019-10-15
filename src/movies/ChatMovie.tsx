import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import SendIcon from '@material-ui/icons/Send';

import { Driver } from "tgrid/components/Driver";
import { HashSet } from "tstl/container/HashSet";

import { IChatService } from "../controllers/IChatService";
import { ChatPrinter } from "../providers/ChatPrinter";
import ListItemIcon from "@material-ui/core/ListItemIcon";

export class ChatMovie
    extends React.Component<ChatMovie.IProps>
{
    private whisper_to_: string | null = null;
    private show_participants_: boolean = false;

    private get input_(): HTMLInputElement
    {
        return document.getElementById("message_input") as HTMLInputElement;
    }

    /* ----------------------------------------------------------------
        CONSTRUCTOR
    ---------------------------------------------------------------- */
    public constructor(props: ChatMovie.IProps)
    {
        super(props);

        // WHENEVER EVENT COMES
        let printer: ChatPrinter = props.printer;
        printer.assign(() => 
        {
            // ERASE WHISPER TARGET
            if (this.whisper_to_ !== null && printer.participants.has(this.whisper_to_) === false)
                this.whisper_to_ = null;
            
            // REFRESH PAGE
            this.setState({})
        });
    }

    public componentDidMount()
    {
        let input: HTMLInputElement = document.getElementById("message_input") as HTMLInputElement;
        input.select();
    }

    public componentDidUpdate()
    {
        let element: HTMLElement = document.getElementById("message_body")!;
        element.scrollTop = element.scrollHeight;

        console.log(element.scrollTop, element.scrollHeight, element.clientHeight, element.offsetHeight);
    }

    /* ----------------------------------------------------------------
        EVENT HANDLERS
    ---------------------------------------------------------------- */
    private _Handle_keyUp(event: React.KeyboardEvent<HTMLInputElement>): void
    {
        if (event.keyCode === 13)
            this._Send_message();
    }

    private _Send_message(): void
    {
        let content: string = this.input_.value;
        if (content === "")
            return;

        let service: Driver<IChatService> = this.props.service;

        if (this.whisper_to_ === null)
            service.talk(content);
        else
            service.whisper(this.whisper_to_, content);
        
        this.input_.value = "";
        this.input_.select();
    }

    protected _Select_participant(name: string): void
    {
        this.whisper_to_ = (this.whisper_to_ === name)
            ? null
            : name;
        
        this.input_.select();
        this.setState({});
    }

    private _Show_participants(flag: boolean): void
    {
        this.show_participants_ = flag;
        this.setState({});
    }

    /* ----------------------------------------------------------------
        RENDERER
    ---------------------------------------------------------------- */
    public render(): JSX.Element
    {
        let participants: JSX.Element = this._Render_participants();

        return <React.Fragment>
            {this._Render_body()}
            <Drawer anchor="right" 
                    open={this.show_participants_}
                    onClose={this._Show_participants.bind(this, false)}>
                {participants}
            </Drawer>
        </React.Fragment>;
    }

    private _Render_participants(): JSX.Element
    {
        let printer: ChatPrinter = this.props.printer;
        let myName: string = printer.name;
        let people: string[] = [ myName ];

        for (let person of printer.participants)
            if (person !== myName)
                people.push(person);

        return <div style={{ width: 225, padding: 15 }}>
            <div>
                <span style={{ fontSize: "x-large" }}> 
                    Participants 
                </span>: #{people.length}
            </div>
            <hr/>
            <Container style={{ paddingBottom: 50 }}>
                <List dense>
                {people.map(person =>
                    <ListItem button
                            selected={person === this.whisper_to_}
                            onClick={this._Select_participant.bind(this, person)}>
                        <ListItemIcon>
                        {person === this.whisper_to_
                            ? <RecordVoiceOverIcon />
                            : <PersonOutlineIcon />
                        }
                        </ListItemIcon>
                        <ListItemText>
                            <span style={{ fontWeight: (person === myName) ? "bold" : undefined }}>
                                {person} 
                            </span>
                        </ListItemText>
                    </ListItem>
                )}
                </List>
            </Container>
        </div>;
    }

    private _Render_body(): JSX.Element
    {
        let printer: ChatPrinter = this.props.printer;
        let participants: HashSet<string> = printer.participants;
        let messages: ChatPrinter.IMessage[] = printer.messages;

        return <React.Fragment>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6"> Chat Application </Typography>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton color="inherit" 
                                onClick={this._Show_participants.bind(this, true)}>
                        <Badge color="secondary"
                               badgeContent={participants.size()}>
                            <PeopleAltIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Container id="message_body" 
                       style={{ paddingBottom: 50 }}>
                { messages.map(msg => this._Render_message(msg)) }
            </Container>
            <AppBar color="inherit" 
                    position="fixed" 
                    style={{ top: "auto", bottom: 0 }}>
                <Toolbar>
                    <Input id="message_input" 
                           fullWidth style={{ paddingRight: 0 }}
                           onKeyUp={this._Handle_keyUp.bind(this)}
                           placeholder={this.whisper_to_ ? `Whisper to '${this.whisper_to_}'` : "Talk to everyone"} />
                    <Button variant="contained" 
                            startIcon={ <SendIcon /> }
                            style={{ marginLeft: 10 }}
                            onClick={this._Send_message.bind(this)}> 
                        Send 
                    </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>;
    }

    private _Render_message(msg: ChatPrinter.IMessage): JSX.Element
    {
        let myName: string = this.props.printer.name;

        let fromMe: boolean = (msg.from === myName);
        let style: React.CSSProperties = {
            textAlign: fromMe ? "right" : undefined,
            fontStyle: msg.to ? "italic" : undefined,
            color: msg.to ? "gray" : undefined
        };
        let content: string = msg.content;

        if (msg.to)
        {
            let head: string = (msg.from === myName)
                ? `(whisper to ${msg.to})`
                : "(whisper)";
            content = `${head} ${content}`;
        }

        return <p style={style}>
            <b style={{ fontSize: 18 }}> {msg.from} </b>
            <br/>
            {content}
        </p>;
    }
}
export namespace ChatMovie
{
    export interface IProps
    {
        service: Driver<IChatService>;
        printer: ChatPrinter;
    }
}