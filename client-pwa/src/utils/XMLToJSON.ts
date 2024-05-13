import xml2js from 'xml2js';

export function xmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xml, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
