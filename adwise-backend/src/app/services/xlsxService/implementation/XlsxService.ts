import { Result } from "../../../core/models/Result";
import { IXlsxService } from "../IXlsxService";
import XLSX from 'xlsx';
import MyRegexp from "myregexp";

export class XlsxService implements IXlsxService {
    public convert(data: object[]): Result<Buffer | null, Error | null> {
        try {
            const columns = new Set<number>();
                        
            for (const index in data) {
                let column = -1;
                for (const key in data[index]) {
                    column++

                    (<any>data[index])[key] = (<any>data[index])[key]?.toString() || '-';

                    if (isNaN(Number((<any>data[index])[key].replace('₽', ''))) || MyRegexp.phone().test((<any>data[index])[key].replace('₽', ''))) continue;

                    columns.add(column);

                    (<any>data[index])[key] = (<any>data[index])[key].replace(' ', '').replace('\'', '');
                }
            }

            data = data.filter(v => !!v);

            const buf = this.jsonToXlsx(columns.values(), data);

            return Result.ok(buf);
        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    private jsonToXlsx(numberColumns: IterableIterator<number>, data: object[]): Buffer {
        const specifyColumnType = (worksheet: XLSX.WorkSheet, col: number, type: string): void => {
            const range = XLSX.utils.decode_range(worksheet['!ref']!);
            // note: range.s.r + 1 skips the header row
            for (let row = range.s.r + 1; row <= range.e.r; ++row) {
                const ref = XLSX.utils.encode_cell({ r: row, c: col });
                const isRubleSign = worksheet[ref].v.includes('₽');

                worksheet[ref].v = worksheet[ref].v.replace('₽', '');

                worksheet[ref].t = type;
                worksheet[ref].z = isRubleSign ? '0.00₽' : '0';
            }
          }
        
        const workSheet = XLSX.utils.json_to_sheet(data, {

        });

        workSheet["!cols"] = Object.entries(data[0]).map(([k, v]) => {
            const maxLength = Math.max(...v.split('\n').map((a: string) => a.length));

            const n = Math.max(k.length, maxLength);
            
            return {width: n + 5};
        });

        workSheet["!rows"] = [{}, ...data.map((obj: object) => {
            for (const v of Object.values(obj)) {
                const n = v.split('\n').length;
            
                if (n > 1) {
                    return {hpx: n * 16};
                }
            }

            return {};
        })];

        const wb = XLSX.utils.book_new();

        let col = 0;
        while ((col = numberColumns.next().value) || col != undefined) {
            specifyColumnType(workSheet, col, 'n');
        }

        XLSX.utils.book_append_sheet(wb, workSheet);

        const buf = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'});

        return buf;
    }
}