import {XMLParser} from "fast-xml-parser";


export function parseXml(xml: string): any {
    const parser = new XMLParser();
    return parser.parse(xml);
}
