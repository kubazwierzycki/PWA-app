import {XMLParser} from "fast-xml-parser";


/**
 * Function parsing fetched XML API response data
 * Uses fast-xml-parser.
 * Note: Only treats data as an array if multiple items present.
 * Turns XML attributes to @_ elements.
 * Turns XML tag values to #_ elements.
 * @param {string} xml - XML response string
 * @returns object representing XML in JSON
 */
export function parseXml(xml: string): any {
    const parser = new XMLParser({ignoreAttributes: false});
    return parser.parse(xml);
}
