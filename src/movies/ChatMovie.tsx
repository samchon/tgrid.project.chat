import React from "react";
import { Panel, 
    ListGroup, ListGroupItem, 
    Button, FormControl, InputGroup, 
    Glyphicon 
} from "react-bootstrap";

import { Driver } from "tgrid/components/Driver";
import { IChatService } from "../controllers/IChatService";
import { ChatPrinter } from "../providers/ChatPrinter";

export class ChatMovie
    extends React.Component<ChatMovie.IProps>
{
    private to_: string | null = null;

    private get input_(): HTMLInputElement
    {
        return document.getElementById("message_input") as HTMLInputElement;
    }

    //----------------------------------------------------------------
    //  CONSTRUCTOR
    //----------------------------------------------------------------
    public constructor(props: ChatMovie.IProps)
    {
        super(props);

        // WHENEVER EVENT COMES
        let printer: ChatPrinter = props.printer;
        printer.assign(() => 
        {
            // ERASE WHISPER TARGET WHEN EXIT
            if (this.to_ !== null)
            {
                let index: number = printer.participants.findIndex(name => name === this.to_);
                if (index === -1)
                    this.to_ = null;
            }
            
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
        element.scrollTop = element.scrollHeight - element.clientHeight;
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
        let content: string = this.input_.value;
        let service: Driver<IChatService> = this.props.service;

        if (this.to_ === null)
            service.talk(content);
        else
            service.whisper(this.to_, content);
        
        this.input_.value = "";
        this.input_.select();
    }

    private _Select_participant(name: string): void
    {
        this.to_ = (this.to_ === name)
            ? null
            : name;
        
        this.input_.select();
        this.setState({});
    }

    //----------------------------------------------------------------
    //  RENDERER
    //----------------------------------------------------------------
    public render(): JSX.Element
    {
        let printer: ChatPrinter = this.props.printer;

        let myName: string = printer.name;
        let participants: string[] = printer.participants;
        let messages: ChatPrinter.IMessage[] = printer.messages;

        return <div className="main">
            <Panel bsStyle="info" 
                   className="participants">
                <Panel.Heading className="panel-pincer">
                    <Panel.Title> 
                        <Glyphicon glyph="user" />
                        {` Participants: #${participants.length}`}
                    </Panel.Title> 
                </Panel.Heading>
                <Panel.Body id="message_body" 
                            className="panel-body">
                    <ListGroup>
                    {participants.map(name => 
                    {
                        return <ListGroupItem active={name === myName} 
                                              bsStyle={name === this.to_ ? "warning" : undefined}
                                              onClick={this._Select_participant.bind(this, name)}>
                        {name === this.to_
                            ? "> " + name
                            : name
                        }
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
                        {" Message"}
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body className="panel-body">
                    {messages.map(msg =>
                    {
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