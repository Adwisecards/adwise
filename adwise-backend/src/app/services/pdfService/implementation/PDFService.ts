import { IPDFService } from "../IPDFService";
import fs from 'fs';
import path from 'path';
import { Result } from "../../../core/models/Result";
const puppeteer = require('puppeteer');
const hb = require('handlebars')

export class PDFService implements IPDFService {
    private templates: {[key: string]: string} = {
        individual: fs.readFileSync(path.join(__dirname, 'templates', 'individualApplication.html'), {encoding: 'utf8'}),
        ip: fs.readFileSync(path.join(__dirname, 'templates', 'ipApplication.html'), {encoding: 'utf8'}),
        ooo: fs.readFileSync(path.join(__dirname, 'templates', 'jpApplication.html'), {encoding: 'utf8'}),
        treaty: fs.readFileSync(path.join(__dirname, 'templates', 'treaty.html'), {encoding: 'utf8'}),
        financialReport: fs.readFileSync(path.join(__dirname, 'templates', 'financialReport.html'), {encoding: 'utf8'}),
        individualManager: fs.readFileSync(path.join(__dirname, 'templates', 'individualManagerApplication.html'), {encoding: 'utf8'}),
        ipManager: fs.readFileSync(path.join(__dirname, 'templates', 'ipManagerApplication.html'), {encoding: 'utf8'}),
        full1200012Individual: fs.readFileSync(path.join(__dirname, 'templates', 'full12000-12.individual.html'), {encoding: 'utf8'}),
        full1200012Ip: fs.readFileSync(path.join(__dirname, 'templates', 'full12000-12.ip.html'), {encoding: 'utf8'}),
        full1200012Jp: fs.readFileSync(path.join(__dirname, 'templates', 'full12000-12.jp.html'), {encoding: 'utf8'}),
        one400012IndividualWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'one4000-12.individual-wisewin.html'), {encoding: 'utf8'}),
        one400012Individual: fs.readFileSync(path.join(__dirname, 'templates', 'one4000-12.individual.html'), {encoding: 'utf8'}),
        one400012IpWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'one4000-12.ip-wisewin.html'), {encoding: 'utf8'}),
        one400012JpWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'one4000-12.jp-wisewin.html'), {encoding: 'utf8'}),
        promo25002IndividualWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'promo2500-2.individual-wisewin.html'), {encoding: 'utf8'}),
        promo25002Individual: fs.readFileSync(path.join(__dirname, 'templates', 'promo2500-2.individual.html'), {encoding: 'utf8'}),
        promo25002IpWisewin: fs.readFileSync(path.join(__dirname, 'templates', 'promo2500-2.ip-wisewin.html'), {encoding: 'utf8'}),
        promo25002Ip: fs.readFileSync(path.join(__dirname, 'templates', 'promo2500-2.ip.html'), {encoding: 'utf8'}),
        promo25002Jp: fs.readFileSync(path.join(__dirname, 'templates', 'promo2500-2.jp.html'), {encoding: 'utf8'}),
    };

    public generatePDF(type: string, values: any): Promise<Result<Buffer | null, Error | null>> {
        return new Promise<any>(async resolve => {
            const template = this.templates[type];

            // htmlPdf.create(this.executeTemplate(template, values), {height: '10000px', width: '10000px'}).toBuffer((err, buf) => {
            //     if (err) {
            //         console.log(err);
            //         return resolve(Result.fail(err));
            //     }
            //     fs.writeFileSync(path.join(__dirname, 'temp123.pdf'), buf)
            //     return resolve(Result.ok(buf));
            // });

            const buf = await this.generatePdf({content: this.executeTemplate(template, values)}, {
                scale: 1, 
                format: 'Legal', 
                width: '8.27in', 
                height: '11.7in', 
                margin: {
                    top: 80, bottom: 0, left: 0, right: 0}});

            return resolve(Result.ok(buf));
            
            return resolve(Result.ok(Buffer.allocUnsafe(10)));
        });
    }

    private executeTemplate(body: string, data: any) {
        console.log(data);
        const executedBody = body?.replace(/\$(\w+)/ig, (_, p1) => {
            console.log(p1);
            return data[p1] == undefined ? '-' : data[p1];
        });
        return executedBody;
    }

    private async generatePdf(file: any, options: any):Promise<any> {

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROME_BIN,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        if(file.content) {
            // we have compiled our code with handlebars
            const template = hb.compile(file.content, { strict: true });
            const result = template(file.content);
            const html = result;

            // We set the page content as the generated html by handlebars
            await page.setContent(html);
        } else {
            await page.goto(file.url, {
                waitUntil: 'networkidle0', // wait for page to load completely
            });
        }

        return new Promise(async resolve => {
            const pdf = await page.pdf(options);
            await browser.close();

            return resolve(Buffer.from(Object.values(pdf)));
        });
    }
}