import React from "react";
import { Driver } from "tgrid/components/Driver";

import { IChatPrinter } from "../controllers/IChatPrinter";
import { IChatService } from "../controllers/IChatService";

export class ChatPrinter 
    extends React.Component<ChatPrinter.IProps>
    implements IChatPrinter
{
    private elements_: JSX.Element[] = [];

    //----------------------------------------------------------------
    //  FUNCTIONS FOR REMOTE SYSTEM
    //----------------------------------------------------------------
    public insert(name: string): void
    {
        // NEW PARTICIPANT
        let participants: string[] = this.props.participants;
        participants.push(name);

        // REFRESH
        this._Print(<p> <b>{name}</b> has come </p>);
    }

    public erase(name: string): void
    {
        let participants: string[] = this.props.participants;
        
        // ERASE FROM PARTICIPANT
        let index: number = participants.findIndex(str => str === name);
        if (index !== -1)
            participants.splice(index, 1);
        
        // REFRESH
        this._Print(<p> <b>{name}</b> has left </p>);
    }

    public talk(from: string, content: string): void
    {
        this._Print(<p> <b>{from}</b>: {content} </p>);
    }

    public whisper(from: string, to: string, content: string): void
    {
        this._Print(<p> <i>{from} to {to}</i>: {content} </p>);
    }

    //----------------------------------------------------------------
    //  RENDERER
    //----------------------------------------------------------------
    public render(): JSX.Element
    {
        let participants: string[] = this.props.participants;

        return <div className="printer">
            <div className="participants">
                <ul>
                    {participants.map(str => <li>{str}</li>)}
                </ul>
            </div>
            <div className="contents">
                {this.elements_}
            </div>
        </div>;
    }

    private _Print(element: JSX.Element): void
    {
        this.elements_.push(element);
        this.setState({});
    }
}
export namespace ChatPrinter
{
    export interface IProps
    {
        name: string;
        participants: string[];
        service: Driver<IChatService>;
    }
}