import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";
import { IChatService } from "./controllers/IChatService";

import { Global } from "./Global";
import { randint } from "tstl/algorithm/random";

namespace FakePrinter
{
    export function insert({}: string): void {};
    export function erase({}: string): void {};
    export function talk({}: string, {}: string): void {};
    export function whisper({}: string, {}: string, {}: string): void {};
}

function random_name(): string
{
    let size: number = randint(4, 8);
    let from: number = "A".charCodeAt(0);
    let to: number = "z".charCodeAt(0);
    
    let ret: string = "";
    for (let i: number = 0; i < size; ++i)
        ret += String.fromCharCode(randint(from, to));
    return ret;
}

async function connect(): Promise<void>
{
    let connector: WebConnector<typeof FakePrinter> = new WebConnector(FakePrinter);
    await connector.connect(`http://127.0.0.1:${Global.PORT}/`);

    let service: Driver<IChatService> = connector.getDriver();
    await service.setName(random_name());
}

async function main(): Promise<void>
{
    for (let i: number = 0; i < 20; ++i)
        connect();
}
main();