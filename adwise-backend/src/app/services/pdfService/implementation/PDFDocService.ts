import { IPDFService } from "../IPDFService";
import fs from 'fs';
import path from 'path';
import { Result } from "../../../core/models/Result";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { exec } from 'child_process';
import * as uuid from 'uuid';
import { logger } from "../../logger";

var expressions = require('angular-expressions');
var assign = require("lodash/assign");
// define your filter functions here, for example, to be able to write {clientname | lower}
expressions.filters.lower = function(input: any) {
    // This condition should be used to make sure that if your input is
    // undefined, your output will be undefined as well and will not
    // throw an error
    if(!input) return input;
    return input.toLowerCase();
}
function angularParser(tag: string) {
    if (tag === '.') {
        return {
            get: function(s: string){ return s;}
        };
    }
    const expr = expressions.compile(
        tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"')
    );
    return {
        get: function(scope: any, context: any) {
            let obj = {};
            const scopeList = context.scopeList;
            const num = context.num;
            for (let i = 0, len = num + 1; i < len; i++) {
                obj = assign(obj, scopeList[i]);
            }
            return expr(scope, obj);
        }
    };
}

export class PDFDocService implements IPDFService {
    private templates: {[key: string]: Buffer} = {
        individual: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'individualApplication.docx')),
        ip: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'ipApplication.docx')),
        ooo: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'jpApplication.docx')),
        treaty: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'treaty.docx')),
        financialReport: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'financialReport.docx')),
        individualManager: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'individualManagerApplication.docx')),
        ipManager: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'ipManagerApplication.docx')),
        full1200012Individual: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'full12000-12.individual.docx')),
        full1200012Ip: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'full12000-12.ip.docx')),
        full1200012Jp: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'full12000-12.jp.docx')),
        one400012IndividualWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'one4000-12.individual-wisewin.docx')),
        one400012Individual: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'one4000-12.individual.docx')),
        one400012IpWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'one4000-12.ip-wisewin.docx')),
        one400012JpWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'one4000-12.jp-wisewin.docx')),
        promo25002IndividualWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'promo2500-2.individual-wisewin.docx')),
        promo25002Individual: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'promo2500-2.individual.docx')),
        promo25002IpWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'promo2500-2.ip-wisewin.docx')),
        promo25002Ip: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'promo2500-2.ip.docx')),
        promo25002Jp: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'promo2500-2.jp.docx')),
        withdrawalActIndividual: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'withdrawalAct.individual.docx')),
        withdrawalActIp: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'withdrawalAct.ip.docx')),
        withdrawalActJp: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'withdrawalAct.jp.docx')),
        couponTerms: fs.readFileSync(path.join(__dirname, 'templates', 'docx', 'couponTerms.docx'))
    };

    private tempFolder = path.join(__dirname, 'temp');

    constructor() {
        try {
            logger.info('PDFService: mkdir:', this.tempFolder);
            fs.mkdirSync(this.tempFolder);
        } catch {
            logger.info('PDFService:', this.tempFolder, 'already exists');
        }
    }

    public async generatePDF(type: string, values: any): Promise<Result<Buffer | null, Error | null>> {
        try {
            logger.info('PDFService: started to generating pdf of type of', type);

            const zip = new PizZip(this.templates[type]);

            const doc = new Docxtemplater(zip, {parser: angularParser});

            doc.setData(values);
            doc.render();

            console.log(values);

            const buf = doc.getZip().generate({type: 'nodebuffer'});

            return await this.convertToPdf(buf);
        } catch (ex) {
            console.log(ex.properties.errors);
            logger.error(ex.stack, 'PDFService: error:', ex.message);
            return Result.fail(ex);
        }
    }

    private convertToPdf(buf: Buffer): Promise<Result<Buffer | null, Error | null>> {
        return new Promise(resolve => {
            try {
                const fromPath = path.join(this.tempFolder, `from_${uuid.v4()}.docx`);
                const toPath = path.join(this.tempFolder, `to_${uuid.v4()}.pdf`);

                logger.info('PDFService: fromPath:', fromPath);
                logger.info('PDFService: toPath:', toPath);

                fs.writeFile(fromPath, buf, (err) => {
                    if (err) {
                        throw err;
                    }

                    logger.info('PDFService: has written to file:', fromPath);
                    
                    const execCommand = `unoconv --format="pdf" --output="${toPath}" ${fromPath}`;
                    
                    logger.info('PDFService: about to execute:', execCommand);
                    exec(execCommand, (err, _, stderr) => {
                        if (err) {
                            throw err;
                        }

                        if (stderr) {
                            throw new Error(stderr);
                        }

                        logger.info('PDFService: docx has been converted to pdf:', toPath);

                        logger.info('PDFService: reading pdf from:', toPath);
                        fs.readFile(toPath, (err, data) => {
                            if (err) {
                                throw err;
                            }

                            logger.info('PDFService: has read pdf successfully');

                            logger.info('PDFService: about to delete temp files:', fromPath, toPath);
                            fs.unlink(toPath, () => {
                                logger.info('PDFService:', toPath, 'has been deleted');
                                fs.unlink(fromPath, () => {
                                    logger.info('PDFService:', fromPath, 'has been deleted');
                                    return resolve(Result.ok(data));
                                });
                            });
                        });
                    });
                })
            } catch (ex) {
                logger.error(ex.stack, 'PDFService: error:', ex.message);
                return resolve(Result.fail(ex));
            }
        });
    }
}