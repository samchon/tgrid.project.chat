import { Driver } from "tgrid/components/Driver";
import { HashMap } from "tstl/container/HashMap";

import { IChatPrinter } from "../controllers/IChatPrinter";

export class ChatService
{
    private participants_: HashMap<string, Driver<IChatPrinter>>;
    private printer_: Driver<IChatPrinter>;
    private name_?: string;

    /* ----------------------------------------------------------------
        CONSTRUCTORS
    ---------------------------------------------------------------- */
    public constructor(participants: HashMap<string, Driver<IChatPrinter>>, printer: Driver<IChatPrinter>)
    {
        this.participants_ = participants;
        this.printer_ = printer;
    }

    public async destructor(): Promise<void>
    {
        if (this.name_ === undefined)
            return;

        // ERASE FROM PARTICIPANTS
        this.participants_.erase(this.name_);

        // INFORM TO OTHERS
        let promises: Promise<void>[] = [];
        for (let it of this.participants_)
            promises.push( it.second.erase(this.name_) );
            
        await Promise.all(promises);
    }

    /* ----------------------------------------------------------------
        INTERACTIONS
    ---------------------------------------------------------------- */
    public async setName(name: string): Promise<boolean>
    {
        if (this.participants_.has(name))
            return false;

        // ASSIGN MEMBER
        this.name_ = name;
        this.participants_.emplace(name, this.printer_);

        //----
        // INFORM TO PARTICIPANTS
        //----
        let nameList: string[] = [...this.participants_].map(it => it.first);
        let promiseList: Promise<void>[] = [];

        for (let it of this.participants_)
        {
            let printer: Driver<IChatPrinter> = it.second;
            let promise: Promise<void> = (printer === this.printer_)
                ? printer.assign(nameList) // ITSELF
                : printer.insert(name); // OTHER ONE

            promiseList.push(promise);
        }

        await Promise.all(promiseList);
        return true;
    }

    public async talk(content: string): Promise<void>
    {
        // MUST BE NAMED
        if (this.name_ === undefined)
            throw new Error("Name is not specified yet.");

        //----
        // INFORM TO PARTICIPANTS
        //----
        let promises: Promise<void>[] = [];
        for (let it of this.participants_)
        {
            let p: Promise<void> = it.second.talk(this.name_, content);
            promises.push(p);
        }
        await Promise.all(promises);
    }

    public async whisper(to: string, content: string): Promise<void>
    {
        // MUST BE NAMED
        if (this.name_ === undefined)
            throw new Error("Name is not specified yet.");
        else if (this.participants_.has(to) === false)
            throw new Error("Unable to find the matched name");

        //----
        // INFORM TO TARGET PARTICIPANTS
        //----
        let from: string = this.name_;
        let promises: Promise<void>[] = [];

        for (let printer of [ this.printer_, this.participants_.get(to) ])
        {
            let p: Promise<void> = printer.whisper(from, to, content);
            promises.push(p);
        }
        await Promise.all(promises);
    }
}