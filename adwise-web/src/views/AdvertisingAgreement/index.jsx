import React, {useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import AdvertisingAgreementDocument from '../../documents/advertising-agreement.pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function AdvertisingAgreement() {
    const [numPages, setPages] = useState(1);
  return (
    <div className='container-lend just-text'>
        <Document
            file={AdvertisingAgreementDocument}
            onLoadSuccess={({numPages}) => setPages(numPages)}
        >
            {Array.apply(null, Array(numPages))
                .map((x, i) => i + 1)
                .map(page => <Page
                    pageNumber={page}
                    scale={1.9}
                />)}
        </Document>
    </div>
  );
}

export default AdvertisingAgreement;
