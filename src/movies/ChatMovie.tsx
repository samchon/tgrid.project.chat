import React from "react";
import { Driver } from "tgrid/components/Driver";

import { IChatService } from "../controllers/IChatService";
import { ChatPrinter } from "../providers/ChatPrinter";
import { Panel, ListGroup, ListGroupItem, Button, FormControl, InputGroup, Glyphicon } from "react-bootstrap";

export class ChatMovie
    extends React.Component<ChatMovie.IProps>
{
    private to_: string | null = null;

    //----------------------------------------------------------------
    //  CONSTRUCTOR
    //----------------------------------------------------------------
    public constructor(props: ChatMovie.IProps)
    {
        super(props);

        // REFRESH WHENEVER MESSAGE COMES
        props.printer.assign(() => this.setState({}));
    }

    public componentDidMount()
    {
        let input: HTMLInputElement = document.getElementById("message_input") as HTMLInputElement;
        input.select();
    }

    //----------------------------------------------------------------
    //  EVENT HANDLERS
    //----------------------------------------------------------------
    private _Handle_keyUp(event: React.KeyboardEvent<FormControl>): void
    {
        if (event.keyCode === 13)
            this._Send_message();
    }

    private _Send_message(): void
    {
        let input: HTMLInputElement = document.getElementById("message_input") as HTMLInputElement;
        let content: string = input.value;
        let service: Driver<IChatService> = this.props.service;

        if (this.to_ === null)
            service.talk(content);
        else
            service.whisper(this.to_, content);
        
        input.value = "";
        input.select();
    }

    private _Select_participant(name: string): void
    {
        this.to_ = (this.to_ === name)
            ? null
            : name;
        this.setState({});
    }

    //----------------------------------------------------------------
    //  RENDERER
    //----------------------------------------------------------------
    public render(): JSX.Element
    {
        let printer: ChatPrinter = this.props.printer;
        let participants: string[] = printer.participants;
        let messages: ChatPrinter.IMessage[] = printer.messages;

        return <div className="main">
            <Panel bsStyle="info" 
                   className="participants">
                <Panel.Heading className="panel-pincer">
                    <Panel.Title> 
                        <Glyphicon glyph="user" />
                        {" "}
                        Participants: #{participants.length} 
                    </Panel.Title> 
                </Panel.Heading>
                <Panel.Body className="panel-body">
                    <ListGroup>
                    {participants.map(name => 
                    {
                        return <ListGroupItem active={name === this.to_} 
                                              onClick={this._Select_participant.bind(this, name)}> 
                            {name} 
                        </ListGroupItem>;
                    })}
                    </ListGroup>
                </Panel.Body>
                <Panel.Footer className="panel-pincer">
                    Example Project of TGrid
                </Panel.Footer>
            </Panel>
            <Panel bsStyle="primary"
                   className="messages">
                <Panel.Heading className="panel-pincer">
                    <Panel.Title> 
                        <Glyphicon glyph="list" />
                        {" "}
                        Messages 
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body className="panel-body">
                    {messages.map(msg =>
                    {
                        if (msg.to)
                            return <p><i><b>{msg.from}</b> whispered to {msg.to}</i>: {msg.content}</p>;
                        else
                            return <p><b>{msg.from}</b>: {msg.content}</p>
                    })}
                </Panel.Body>
                <Panel.Footer className="panel-pincer">
                    <InputGroup>
                        <FormControl id="message_input" 
                                     type="text"
                                     onKeyUp={this._Handle_keyUp.bind(this)} />
                        <InputGroup.Button>
                            <Button onClick={this._Send_message.bind(this)}>
                            {this.to_ === null
                                ? <React.Fragment>
                                    <Glyphicon glyph="bullhorn" />
                                    Talk to everyone
                                </React.Fragment>
                                : <React.Fragment>
                                    <Glyphicon glyph="screenshot" />
                                    Whisper to {this.to_}
                                </React.Fragment>
                            }
                            </Button>
                        </InputGroup.Button>
                    </InputGroup>
                </Panel.Footer>
            </Panel>
        </div>;
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