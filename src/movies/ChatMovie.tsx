import React from "react";
import { Driver } from "tgrid/components/Driver";

import { IChatService } from "../controllers/IChatService";
import { ChatPrinter } from "../providers/ChatPrinter";
import { Panel, ListGroup, ListGroupItem } from "react-bootstrap";

export class ChatMovie
    extends React.Component<ChatMovie.IProps>
{
    public constructor(props: ChatMovie.IProps)
    {
        super(props);

        // REFRESH WHENEVER MESSAGE COMES
        props.printer.assign(() => this.setState({}));
    }

    public render(): JSX.Element
    {
        let printer: ChatPrinter = this.props.printer;
        let participants: string[] = printer.participants;
        let messages: ChatPrinter.IMessage[] = printer.messages;

        return <div className="main">
            <Panel bsStyle="info" 
                   className="participants">
                <Panel.Heading className="panel-pincer">
                    <Panel.Title> Participants: #{participants.length} </Panel.Title> 
                </Panel.Heading>
                <Panel.Body className="panel-body">
                    <ListGroup>
                    {participants.map(name => 
                        <ListGroupItem> {name} </ListGroupItem>
                    )}
                    </ListGroup>
                </Panel.Body>
                <Panel.Footer className="panel-pincer">
                    Example Project of TGrid
                </Panel.Footer>
            </Panel>
            <Panel bsStyle="primary"
                   className="messages">
                <Panel.Heading className="panel-pincer">
                    <Panel.Title> Messages </Panel.Title>
                </Panel.Heading>
                <Panel.Body className="panel-body">
                    {messages.map(msg =>
                    {
                        if (msg.to)
                            return <p><i>{msg.from} to {msg.to}</i>: {msg.content}</p>;
                        else
                            return <p><b>{msg.from}</b>: {msg.content}</p>
                    })}
                </Panel.Body>
                <Panel.Footer className="panel-pincer">
                    YAHO
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