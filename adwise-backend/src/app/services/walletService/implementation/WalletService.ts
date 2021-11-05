import { IWalletService, passType } from '../IWalletService';
import { Template } from '@walletpass/pass-js';
import { Result } from '../../../core/models/Result';
import fs from 'fs';
import path from 'path';
import { configProps } from '../../config';
import moment from "moment";

export class WalletService implements IWalletService {
    private assets = {
        contactCert: fs.readFileSync(path.join(__dirname, 'certs', 'p12conatacont.pem')),
        couponCert: fs.readFileSync(path.join(__dirname, 'certs', 'couponp12_15_16.pem'))
    };

    // private template: Template;

    constructor() {
        // this.template = this.generateTemplate();
    }

    public async generateContactPass(id: string, refCode: string, firstName: string, lastName: string, activity: string, organization: string, phone: string, email: string): Promise<Result<Buffer | null, Error | null>> {    
        try {
            const template = await this.generateTemplate();

            template.setCertificate(this.assets.contactCert.toString('utf8'), 'Vipklient1');

            const pass = template.createPass({
                appLaunchURL: `${configProps.frontendUrl}/ref/${refCode}`,
                barcodes: [{
                    format: 'PKBarcodeFormatQR',
                    message: `${configProps.frontendUrl}/ref/${refCode}`,
                    messageEncoding: 'iso-8859-1',
                    altText: '',
                }],
                serialNumber: id,
                description: 'Электронная визитная карточка AdWise',
                generic : {

                }
            });
     
            pass.primaryFields.add({key: 'name', label: 'Имя', value: `${firstName}${lastName ? ' '+lastName : ''}`});
            
            pass.secondaryFields.add({key: 'activity', label: '', value: activity, textAlignment: 'PKTextAlignmentLeft'});
            pass.secondaryFields.add({key: 'phone', label: 'Телефон', value: phone, textAlignment: 'PKTextAlignmentRight', });
            
            pass.backFields.add({key: 'phoneBack', label: 'Телефон', value: phone});

            if (email) {
                pass.backFields.add({key: 'email', label: 'Эл. почта', value: email});
            }
            
            if (organization) {
                pass.backFields.add({key: 'organization', label: 'Организация', value: organization});
                pass.headerFields.add({key: 'organization', label: 'Организация', value: organization});
            }


            pass.images.add('strip', __dirname+'/template/strip.png')

            const buf = await pass.asBuffer();
            fs.writeFileSync("example.pkpass", buf);
    
            return Result.ok(await pass.asBuffer());
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public async generateCouponPass(id: string, refCode: string, coupon: string, date: Date, organization: string, sum: number): Promise<Result<Buffer | null, Error | null>> {
        try {
            const template = await this.generateTemplate();
            
            template.setCertificate(this.assets.couponCert.toString('utf8'), 'Vipklient1');

            const pass = template.createPass({
                appLaunchURL: `${configProps.frontendUrl}/ref/${refCode}`,
                barcodes: [{
                    format: 'PKBarcodeFormatQR',
                    message: `${configProps.frontendUrl}/ref/${refCode}`,
                    messageEncoding: 'iso-8859-1',
                    altText: '',
                }],
                serialNumber: id,
                description: 'Оплаченная покупка в AdWise',
                generic: {}
            });
     
            pass.primaryFields.add({key: 'name', label: 'Название', value: coupon});
            
            pass.secondaryFields.add({key: 'date', label: 'Дата', value: moment(date).format('DD.MM.YYYY'), textAlignment: 'PKTextAlignmentLeft'});
            pass.secondaryFields.add({key: 'sum', label: 'Оплачено', value: sum+'₽', textAlignment: 'PKTextAlignmentRight'});
            
            pass.backFields.add({key: 'date', label: 'Дата', value: date});
            pass.backFields.add({key: 'sum', label: 'Оплачено', value: sum});
            
            pass.backFields.add({key: 'organization', label: 'Организация', value: organization});
            pass.headerFields.add({key: 'organization', label: 'Организация', value: organization});


            pass.images.add('strip', __dirname+'/template/strip.png');

            const buf = await pass.asBuffer();
            fs.writeFileSync("example.pkpass", buf);
    
            return Result.ok(await pass.asBuffer());
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    private async generateTemplate(): Promise<Template> {
        // const template = new Template('generic', {
        //     passTypeIdentifier: 'pass.ad.wise.win',
        //     teamIdentifier: '357NW36NDH',
        //     backgroundColor: '#8152E4',
        //     sharingProhibited: true,
        //     organizationName: 'AdWise'
        // });

        const template = await Template.load(path.join(__dirname, 'template'));

        // await template.images.add('logo', path.join(__dirname, 'assets', 'logo.png'), '3x');
        // template.logoText = 'AdWise'
        // await template.images.add('icon', path.join(__dirname, 'assets', 'icon.png'), '3x');
        //template.setPrivateKey()

        return template;
    }
}