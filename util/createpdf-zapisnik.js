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

  const complaintDecisionName = `Zapisnik_${record.brojZapisnika.replace(
    '/',
    '-'
  )}.pdf`;
  const complaintDecisionPath = path.join(
    'public',
    'Data',
    'complaints',
    complaintDecisionName
  );
  const pdfDoc = new PDFDocument({
    margins: { top: 25, bottom: 25, left: 40, right: 40 },
    page: 'A4',
  });

  pdfDoc.pipe(fs.createWriteStream(complaintDecisionPath));

  pdfDoc.registerFont('ArialCE', path.join('public', 'fonts', 'ArialCE.ttf'));
  pdfDoc.registerFont(
    'ArialBD',
    path.join('public', 'fonts', 'Arial-bold.ttf')
  );
  pdfDoc.registerFont(
    'Symbols',
    path.join('public', 'fonts', 'Wingdings3.ttf')
  );
  pdfDoc.registerFont(
    'MotoPlus',
    path.join('public', 'fonts', 'BladeCutThru.ttf')
  );

  pdfDoc.font('ArialBD').fontSize(20).text('REKLAMACIJSKI ZAPISNIK');

  pdfDoc.fontSize(14).text('MOTO PLUS D.O.O. KRAGUEJVAC', pdfDoc.x, 25, {
    align: 'right',
    lineGap: 6,
  });
  pdfDoc.font('ArialCE').fontSize(11).text('Ulica Marka Zagorca 1b,', {
    align: 'right',
    lineGap: 1,
  });
  pdfDoc.text('34000 Kragujevac', {
    align: 'right',
    lineGap: 1,
  });
  pdfDoc.text('Tel: +381 34 385 350', {
    align: 'right',
    lineGap: 1,
  });
  pdfDoc.text('E-Mail: office@motoplus.rs', {
    align: 'right',
    lineGap: 1,
  });
  pdfDoc.text('PIB: 105055395, MB: 20302534', {
    align: 'right',
    lineGap: 1,
  });

  let yr = record.datumZapisnika.split('-')[0];
  let mth = record.datumZapisnika.split('-')[1];
  let day = record.datumZapisnika.split('-')[2];

  pdfDoc
    .fontSize(12)
    .text('Datum rešavanja reklamacije: ', pdfDoc.x, 70, {
      lineGap: 10,
      continued: true,
    })
    .font('ArialBD')
    .text(`${day}.${mth}.${yr}.`);
  pdfDoc
    .font('ArialCE')
    .text('Broj zapisnika: ', { continued: true })
    .font('ArialBD')
    .text(`${record.brojZapisnika}`);

  pdfDoc.moveDown(1.2);

  pdfDoc
    .moveTo(40, pdfDoc.y)
    .lineTo(pdfDoc.page.width - 40, pdfDoc.y)
    .stroke();

  pdfDoc.moveDown(0.7);

  let yCoord = pdfDoc.y;
  let xCoord = 360;

  yr = record.datumPrijema.split('-')[0];
  mth = record.datumPrijema.split('-')[1];
  dat = record.datumPrijema.split('-')[2];

  pdfDoc
    .font('ArialBD')
    .text('Datum prijema: ', { continued: true, width: xCoord, lineGap: 10 })
    .font('ArialCE')
    .text(`${day}.${mth}.${yr}.`);

  pdfDoc
    .font('ArialBD')
    .text('Tip akumulatora: ', { continued: true, width: xCoord, lineGap: 10 })
    .font('ArialCE')
    .text(`${record.tipAkumulatora}`);

  pdfDoc
    .font('ArialBD')
    .text('Vozilo: ', { continued: true, width: xCoord, lineGap: 10 })
    .font('ArialCE')
    .text(`${record.tipVozila}`);

  let yHeight = pdfDoc.y;

  pdfDoc
    .font('ArialBD')
    .text('Broj računa: ', xCoord + 40, yCoord, {
      continued: true,
      width: 170,
      lineGap: 10,
    })
    .font('ArialCE')
    .text(`${record.brojRacuna}`);

  pdfDoc
    .font('ArialBD')
    .text('Broj akumulatora: ', { continued: true, width: 170, lineGap: 10 })
    .font('ArialCE')
    .text(`${record.brojAkumulatora}`)
    .stroke();

  pdfDoc
    .font('ArialBD')
    .text('Broj prijema: ', { continued: true, width: 170, lineGap: 10 })
    .font('ArialCE')
    .text(`${record.brojPrijema}`);

  if(yHeight > pdfDoc.y) {
    pdfDoc.y = yHeight;
  }

  pdfDoc
    .moveTo(40, pdfDoc.y)
    .lineTo(pdfDoc.page.width - 40, pdfDoc.y)
    .stroke();

  pdfDoc.moveDown(0.7);

  yCoord = pdfDoc.y;

  let verticalLine_yCoordStart = yCoord;
  let verticalLine_yCoordStop;

  pdfDoc.font('ArialBD').text('STANJE AKUMULATORA NA PRIJEMU', 40, pdfDoc.y, {
    width: (pdfDoc.page.width - 80) / 2,
    align: 'center',
    lineGap: 7,
  });

  pdfDoc
    .fontSize(11)
    .text('Napon na prijemu: ', {
      width: (pdfDoc.page.width - 80) / 2,
      continued: true,
      lineGap: 5,
    })
    .font('ArialCE')
    .text(`${record.additionalinfo.preNapon}V`);

  pdfDoc
    .font('ArialBD')
    .text('Stanje napunjenosti: ', {
      width: (pdfDoc.page.width - 80) / 2,
      continued: true,
      lineGap: 5,
    })
    .font('ArialCE')
    .text(`${record.additionalinfo.preNapunjenost}%`);

  xCoord = pdfDoc.x;
  yCoord = pdfDoc.y;

  let xCoordSum = 0;

  pdfDoc
    .fontSize(11)
    .font('ArialBD')
    .text('Ćelija', {
      width: pdfDoc.widthOfString('Celija'),
      align: 'center',
    });

  xCoordSum += 48 + pdfDoc.widthOfString('Celija');

  pdfDoc.text('Gustina elekt.', xCoordSum, yCoord, {
    width: pdfDoc.widthOfString('Gustina elekt.'),
    align: 'center',
  });

  xCoordSum += 8 + pdfDoc.widthOfString('Gustina elekt.');

  pdfDoc.text('Nivo elekt.', xCoordSum, yCoord, {
    width: pdfDoc.widthOfString('Nivo elekt.'),
    align: 'center',
  });

  xCoordSum += 8 + pdfDoc.widthOfString('Nivo elekt.');

  pdfDoc.text('Zamućenost', xCoordSum, yCoord, {
    width: pdfDoc.widthOfString('Zamucenost'),
    align: 'center',
  });

  xCoordSum += pdfDoc.widthOfString('Zamucenost');

  pdfDoc.moveDown(0.5);

  xCoord = 40;
  yCoord = pdfDoc.y;

  for (let i = 1; i <= 6; i++) {
    pdfDoc.fontSize(11);
    pdfDoc.font('ArialCE').text(`${i}.`, xCoord, yCoord, {
      width: pdfDoc.widthOfString('Celija'),
      align: 'center',
    });

    xCoordSum = 50 + pdfDoc.widthOfString('Celija');

    pdfDoc.text(
      `${record.additionalinfo['preGustCel' + i]} g/cm3`,
      xCoordSum,
      yCoord,
      {
        width: pdfDoc.widthOfString('Gustina elekt.'),
        align: 'center',
      }
    );

    xCoordSum += 12 + pdfDoc.widthOfString('Gustina elekt.');

    pdfDoc.text(
      `${record.additionalinfo['preNivoElCel' + i]}`,
      xCoordSum,
      yCoord,
      {
        width: pdfDoc.widthOfString('Nedovoljan'),
        align: 'center',
      }
    );

    xCoordSum += 8 + pdfDoc.widthOfString('Nedovoljan');

    pdfDoc.text(
      `${record.additionalinfo['preZamucenaCel' + i]}`,
      xCoordSum,
      yCoord,
      {
        width: pdfDoc.widthOfString('Nije zamucen'),
        align: 'center',
      }
    );

    pdfDoc.moveDown(0.3);

    xCoord = 40;
    yCoord = pdfDoc.y;
  }

  verticalLine_yCoordStop = yCoord;

  pdfDoc
    .moveTo(pdfDoc.page.width / 2, verticalLine_yCoordStart)
    .lineTo(pdfDoc.page.width / 2, verticalLine_yCoordStop)
    .stroke();

  pdfDoc
    .font('ArialBD')
    .fontSize(12)
    .text(
      'STANJE AKUMULATORA NAKON SERVISA',
      pdfDoc.page.width / 2,
      verticalLine_yCoordStart,
      {
        width: (pdfDoc.page.width - 80) / 2,
        align: 'center',
        lineGap: 7,
      }
    );

  xCoord = pdfDoc.x + 10;
  yCoord = pdfDoc.y;

  pdfDoc
    .fontSize(11)
    .text('Napon na prijemu: ', xCoord, yCoord, {
      width: (pdfDoc.page.width - 80) / 2,
      continued: true,
      lineGap: 5,
    })
    .font('ArialCE')
    .text(`${record.additionalinfoafter.posleNapon}V`);

  pdfDoc
    .font('ArialBD')
    .text('Stanje napunjenosti: ', {
      width: (pdfDoc.page.width - 80) / 2,
      continued: true,
      lineGap: 5,
    })
    .font('ArialCE')
    .text(`${record.additionalinfoafter.posleNapunjenost}%`);

  xCoord = pdfDoc.x;
  yCoord = pdfDoc.y;

  xCoordSum = xCoord;

  pdfDoc
    .fontSize(11)
    .font('ArialBD')
    .text('Ćelija', {
      width: pdfDoc.widthOfString('Celija'),
      align: 'center',
    });

  xCoordSum += 8 + pdfDoc.widthOfString('Celija');

  pdfDoc.text('Gustina elekt.', xCoordSum, yCoord, {
    width: pdfDoc.widthOfString('Gustina elekt.'),
    align: 'center',
  });

  xCoordSum += 8 + pdfDoc.widthOfString('Gustina elekt.');

  pdfDoc.text('Nivo elekt.', xCoordSum, yCoord, {
    width: pdfDoc.widthOfString('Nivo elekt.'),
    align: 'center',
  });

  xCoordSum += 8 + pdfDoc.widthOfString('Nivo elekt.');

  pdfDoc.text('Zamućenost', xCoordSum, yCoord, {
    width: pdfDoc.widthOfString('Zamucenost'),
    align: 'center',
  });

  xCoordSum += pdfDoc.widthOfString('Zamucenost');

  pdfDoc.moveDown(0.4);

  xCoord = pdfDoc.page.width / 2 + 12;
  yCoord = pdfDoc.y;

  for (let i = 1; i <= 6; i++) {
    pdfDoc.fontSize(11);
    pdfDoc.font('ArialCE').text(`${i}.`, xCoord, yCoord, {
      width: pdfDoc.widthOfString('Celija'),
      align: 'center',
    });

    xCoordSum = pdfDoc.page.width / 2 + 12;
    xCoordSum += 8 + pdfDoc.widthOfString('Celija');

    pdfDoc.text(
      `${record.additionalinfoafter['posleGustCel' + i]} g/cm3`,
      xCoordSum,
      yCoord,
      {
        width: pdfDoc.widthOfString('Gustina elekt.'),
        align: 'center',
      }
    );

    xCoordSum += 12 + pdfDoc.widthOfString('Gustina elekt.');

    pdfDoc.text(
      `${record.additionalinfoafter['posleNivoElCel' + i]}`,
      xCoordSum,
      yCoord,
      {
        width: pdfDoc.widthOfString('Nedovoljan'),
        align: 'center',
      }
    );

    xCoordSum += 8 + pdfDoc.widthOfString('Nedovoljan');

    pdfDoc.text(
      `${record.additionalinfoafter['posleZamucenaCel' + i]}`,
      xCoordSum,
      yCoord,
      {
        width: pdfDoc.widthOfString('Nije zamucen'),
        align: 'center',
      }
    );

    pdfDoc.moveDown(0.3);

    xCoord = pdfDoc.page.width / 2 + 12;
    yCoord = pdfDoc.y;
  }

  pdfDoc.moveDown(0.7);

  pdfDoc
    .moveTo(40, pdfDoc.y)
    .lineTo(pdfDoc.page.width - 40, pdfDoc.y)
    .stroke();

  pdfDoc.moveDown(0.3);

  pdfDoc
    .fontSize(6)
    .text(
      `Gustina elektrolita zdrave baterije treba biti između 1,22 i 1,28 stepena bometra, vrednost preko 1,28 znači da je baterija prepunjavana, dok gustina ispod 1,22 označava da postoji električna ispražnjenost kao posledica neodržavanja ili neispravnosti punjenja. Nivo elektrolita u svakoj od ćelija mora prekrivati gornji sloj olovne ploče, minimum 10mm, a najviše 20mm. Ukoliko se zbog preopterećivanja baterije nivo elektrolita smanji, potrebno je doliti strogo samo destilovanu vodu. Elektrolit mora biti čist, ukoliko nije čist to označava preopterećivanje baterije.`,
      40,
      pdfDoc.y,
      {
        align: 'justify',
      }
    );

  pdfDoc.moveDown(0.5);

  pdfDoc
    .moveTo(40, pdfDoc.y)
    .lineTo(pdfDoc.page.width - 40, pdfDoc.y)
    .stroke();

  pdfDoc.moveDown();

  pdfDoc.font('ArialBD').fontSize(12).text('KOMENTAR NAKON SERVISA: ');

  pdfDoc.moveDown(0.5);

  pdfDoc
    .font('ArialCE')
    .fontSize(11)
    .text(`${record.noteAndAdvice.note}`, { align: 'justify' });

  pdfDoc.moveDown(0.5);

  pdfDoc
    .moveTo(40, pdfDoc.y)
    .lineTo(pdfDoc.page.width - 40, pdfDoc.y)
    .stroke();

  pdfDoc.moveDown(0.5);

  pdfDoc.font('ArialBD').fontSize(12).text('SAVETI SERVISERA: ');

  pdfDoc.moveDown(0.5);

  let preGustCel_low = 0;
  let preGustCel_high = 0;
  let preZamucenaCel = 0;
  let preNivoElCel = 0;
  for (let i = 1; i <= 6; i++) {
    if (record.additionalinfo['preGustCel' + i] < 1.22) {
      preGustCel_low++;
    } else if (record.additionalinfo['preGustCel' + i] > 1.28) {
      preGustCel_high++;
    }
    if (record.additionalinfo['preNivoElCel' + i] === 'Nedovoljan') {
      preNivoElCel++;
    }
    if (record.additionalinfo['preZamucenaCel' + i] === 'Zamućen') {
      preZamucenaCel++;
    }
  }
  if (preGustCel_low > 0) {
    pdfDoc
      .font('Symbols')
      .fontSize(11)
      .text(`u `, { continued: true })
      .font('ArialCE')
      .fontSize(11)
      .text(
        `${preGustCel_low}/6 ćelija ima gustinu elektrolita manju od 1.22 g/cm3, što označava električnu ispražnjenost ćelije, preporučuje se da proverite punjenje na vozilu. Ukoliko je punjenje dobro, proverite da li postoji kontakt klema/stubića sa nekim drugim provodnim materijalom ili provodnom tečnošću.`,
        { align: 'justify' }
      );
    pdfDoc.moveDown(0.5);
  }

  if (preGustCel_high > 0) {
    pdfDoc
      .font('Symbols')
      .fontSize(11)
      .text(`u `, { continued: true })
      .font('ArialCE')
      .fontSize(11)
      .text(
        `${preGustCel_high}/6 ćelija ima gustinu elektrolita veću od 1.28 g/cm3, što označava električnu prepunjenost, savetuje se da proverite punjenje na vozilu, takođe da znate da svako punjenje od strane nestručnog lica ili nekvalitetnim punjačima može trajno oštetiti bateriju.`,
        { align: 'justify' }
      );
    pdfDoc.moveDown(0.5);
  }

  if (preNivoElCel > 0) {
    pdfDoc
      .font('Symbols')
      .fontSize(11)
      .text(`u `, { continued: true })
      .font('ArialCE')
      .fontSize(11)
      .text(
        `${preNivoElCel}/6 ćelija ima nivo elektrolita manji od potrebnog, preporučuje se da minimum 2x godisnje proverite nivo elektrolita u svim ćelijama i po potrebi dolijete strogo destilovanu vodu. Nivo elektrolita treba biti 10-20mm iznad gornje ivice olovne ploče, dakle ploča mora biti potopljena u elektrolit.`,
        { align: 'justify' }
      );
    pdfDoc.moveDown(0.5);
  }

  if (preZamucenaCel > 0) {
    pdfDoc
      .font('Symbols')
      .fontSize(11)
      .text(`u `, { continued: true })
      .font('ArialCE')
      .fontSize(11)
      .text(
        `${preZamucenaCel}/6 ćelija ima zamućen elektrolit, preporučuje se da proverite da li je akumulator propisane snage za Vaše vozilo, da proverite punjenje na vozilu kao i imate u vidu da svako punjenje akumulatora neadekvatnim punjacima može naneti štetu bateriji. Zamućen elektrolit označava preopterećivanje akumulatora verglanjem ili prekomerno punjenje.`,
        { align: 'justify' }
      );
    pdfDoc.moveDown(0.5);
  }

  if (record.additionalinfo.prljavaZamascena === 'yes') {
    pdfDoc
      .font('Symbols')
      .fontSize(11)
      .text(`u `, { continued: true })
      .font('ArialCE')
      .fontSize(11)
      .text(
        `Kada je gornja ploča prljava/masna od provodljive tečnosti(kiseline) javlja se statički napon. Do statičkog napona dolazi usled neodržavanja čistoće gornje ploče baterija koja ne sme biti zamašćena ili zaprljana od neke druge provodljive tečnosti. Kada postoji statički elektricitet, baterija je u konstantnom spoju i pražnjenju 24h bez obzira što se vozilo ne koristi.`,
        { align: 'justify' }
      );
    pdfDoc.moveDown(0.5);
  }

  if (
    record.additionalinfo.stanjeStubica === 'yes' ||
    record.additionalinfo.stanjeStubica === 'yes-sulf' ||
    record.additionalinfo.stanjeStubica === 'yes-both'
  ) {
    pdfDoc
      .font('Symbols')
      .fontSize(11)
      .text(`u `, { continued: true })
      .font('ArialCE')
      .fontSize(11)
      .text(
        `Baterijski izvodi moraju biti celi, čisti, tj. ošmirglani zbog kvalitetnog spoja kleme i stubića baterije. Ako je ili klema ili stubić oštećen ili zaprljan odnosno sulfatizovan baterija neće imati dobro punjenje, i isto tako baterija neće moći da da svoj maksimum prilikom startovanja vozila. Savetuje se zamena starih klema novim, prilikom zamene akumulatora.`,
        { align: 'justify' }
      );
    pdfDoc.moveDown(0.5);
  }

  pdfDoc.moveDown();

  pdfDoc.text('Ime i prezime servisera: ____________________', {
    align: 'right',
  });

  pdfDoc.moveDown();

  pdfDoc.text('Potpis i pečat: ____________________', { align: 'right' });

  pdfDoc.end();
};

exports.createPDF = createPDF;
