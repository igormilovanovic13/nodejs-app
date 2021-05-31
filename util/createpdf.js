const Record = require('../models/complaint-record');

const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const createPDF = async (recordId) => {
  const record = await Record.findByPk(recordId, {
    include: [
      'mypartner',
      'additionalinfo',
      'additionalinfoafter',
      'noteAndAdvice',
    ],
  });

  const complaintDecisionName = `Odluka_o_reklamaciji_${record.brojZapisnika.replace(
    '/',
    '-'
  )}.pdf`;
  const complaintDecisionPath = path.join(
    'public',
    'Data',
    'complaint-decisions',
    complaintDecisionName
  );
  const pdfDoc = new PDFDocument({ margin: 50, page: 'A4' });

  pdfDoc.pipe(fs.createWriteStream(complaintDecisionPath));

  pdfDoc.registerFont(
    'TimesNewRoman',
    path.join('public', 'fonts', 'Times New Roman 400.ttf')
  );
  pdfDoc.registerFont(
    'TimesNewRomanBold',
    path.join('public', 'fonts', 'TIMESBD0.TTF')
  );
  pdfDoc.registerFont(
    'BladeCutThru',
    path.join('public', 'fonts', 'BladeCutThru.ttf')
  );
  pdfDoc.font('TimesNewRomanBold');

  pdfDoc.image('Images/HEDER-NOVI.jpg', 30, 30, {
    fit: [535, 110],
    align: 'center',
  });
  pdfDoc.moveDown(7);

  pdfDoc.rect(315, 150, 245, 80).stroke();

  pdfDoc.fontSize(12);
  if(record.mypartner.ime.length + record.mypartner.adresa.length + record.mypartner.postanskibroj.length + record.mypartner.grad.length > 100) {
    pdfDoc.fontSize(10);
  }
  pdfDoc.text(`${record.mypartner.ime},`, 325, 155, {
    align: 'left',
    width: 225,
  });
  pdfDoc.text(`${record.mypartner.adresa},`, {
    align: 'left',
    width: 225,
  });
  pdfDoc.text(`${record.mypartner.postanskibroj} ${record.mypartner.grad}`, {
    align: 'left',
    width: 225,
  });
  if(record.mypartner.ime.length + record.mypartner.adresa.length + record.mypartner.postanskibroj.length + record.mypartner.grad.length > 100) {
    pdfDoc.fontSize(12);
  }

  pdfDoc.moveDown();
  const datum = new Date(Date.now())
    .toLocaleString('pl-PL', { timeZone: 'UTC' })
    .split(',')[0];
  pdfDoc.text(`DATUM: ${datum}`, 50, 250, {
    align: 'left',
  });
  pdfDoc.moveDown();
  pdfDoc.text(`PREDMET: ODLUKA O REKLAMACIJI`, {
    align: 'left',
  });
  pdfDoc.font('TimesNewRoman');
  pdfDoc.moveDown();
  let datumPrijema = record.datumPrijema.split('-');
  datumPrijema = `${datumPrijema[2]}.${datumPrijema[1]}.${datumPrijema[0]}`;
  let datumZapisnika = record.datumZapisnika.split('-');
  datumZapisnika = `${datumZapisnika[2]}.${datumZapisnika[1]}.${datumZapisnika[0]}`;
  pdfDoc.text(
    `Na osnovu izdate potvrde o prijemu reklamacije broj ${record.brojPrijema} od ${datumPrijema} godine, reklamacijskog zapisnika broj ${record.brojZapisnika} od ${datumZapisnika} godine, dostavljamo Vam odluku o rešavanju iste.`,
    {
      align: 'justify',
      width: 495,
    }
  );
  pdfDoc.moveDown();
  pdfDoc.font('TimesNewRomanBold');
  pdfDoc.text(`Obrazloženje:`, {
    align: 'left',
  });
  pdfDoc.fontSize(12).text(`${record.noteAndAdvice.note}`, {
    align: 'justify',
    width: 495,
  });
  pdfDoc.moveDown();
  pdfDoc.text(`Odluka:`, {
    align: 'left',
  });
  let decision;
  if (record.decision === 'null' || record.decision === 'denied') {
    decision = 'ne ';
  } else {
    decision = '';
  }

  pdfDoc
    .font('TimesNewRoman')
    .text(`Ovakav vid reklamacije se `, {
      underline: true,
      continued: true,
    })
    .font('TimesNewRomanBold')
    .text(`${decision}usvaja.`, {
      align: 'justify',
      underline: true,
    });

  pdfDoc.moveDown();
  pdfDoc.font('TimesNewRoman');
  pdfDoc.text(
    `Kupac je obavešten o ishodu reklamacije, odluka je poslata kupcu sa vraćenim akumulatorom i na mail: ${record.mypartner.email}.`,
    {
      align: 'justify',
      width: 495,
    }
  );
  pdfDoc.moveDown();
  pdfDoc.text(`Lice zaduzeno za rešavanje reklamacija`, 355, pdfDoc.y);
  pdfDoc.moveDown();
  pdfDoc.font('BladeCutThru').fontSize(18).text(`MOTO PLUS D.O.O.`, 410, pdfDoc.y);
  pdfDoc.font('TimesNewRomanBold');
  pdfDoc.text(`_______________`, 410, pdfDoc.y);

  pdfDoc.font('TimesNewRoman').fontSize(10).text('Obrazac br. 00.06', 50, pdfDoc.page.height - 30, {
    lineBreak: false
  });

  pdfDoc.end();
};

exports.createPDF = createPDF;
