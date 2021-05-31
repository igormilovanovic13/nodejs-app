const sequelize = require('../util/database');
const Partner = require('../models/partner');
const Record = require('../models/complaint-record');
const pdfOdluka = require('../util/createpdf');
const pdfZapisnik = require('../util/createpdf-zapisnik');
const jimp = require('jimp');

let globalPartnerInfo;

exports.newComplaint = (req, res, next) => {
  res.render('employee/add-complaint/add-partner', {
    pageTitle: 'Nova reklamacija',
    path: '/add-partner',
    message: 'Reklamacijski zapisnik',
  });
};

exports.ajaxData = (req, res, next) => {
  const partnerPIB = req.body.pib;
  Partner.findOne({ where: { PIB: partnerPIB } })
    .then((partner) => {
      if (!partner) {
        sequelize
          .query(
            `SELECT code, name, address, city, zip, email FROM partner WHERE code=${partnerPIB}`
          )
          .then((partners) => {
            const partner = partners[0];
            partner[0].name = partner[0].name.replace('Æ', 'Ć').replace('æ', 'ć').replace('È', 'Č').replace('è', 'č');
            partner[0].address = partner[0].address.replace('Æ', 'Ć').replace('æ', 'ć').replace('È', 'Č').replace('è', 'č');
            partner[0].city = partner[0].city.replace('Æ', 'Ć').replace('æ', 'ć').replace('È', 'Č').replace('è', 'č');
            if (partner[0]) {
              res.send(JSON.stringify(partner[0]));
            } else {
              const message = {
                message: `NE postoji partner sa PIB-om >>> ${partnerPIB}`,
                failed: true,
              };
              res.send(JSON.stringify(message));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const partnerData = {
          code: partner.PIB,
          name: partner.ime,
          address: partner.adresa,
          zip: partner.postanskibroj,
          city: partner.grad,
          email: partner.email,
        };
        res.send(JSON.stringify(partnerData));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.partnerInfoHandler = (req, res, next) => {
  res.redirect(`/add-complaint/battery-info-input/1`); //OVO VISE NIJE POTREBNO IZMENITI RUTU BEZ ID-a
};

exports.batteryInfoInput = (req, res, next) => {
  const partId = req.params.partnerId;
  const productInfo = sequelize
    .query(
      'SELECT name, code FROM product WHERE active="y" AND (manufname="Dynamic" OR manufname="Midac")'
    )
    .then((productsNames) => {
      res.render('employee/add-complaint/battery-info-input', {
        pageTitle: 'Informacije o bateriji',
        path: 'Mora nesto da stoji',
        message: 'U ovom koraku unosimo osnovne podatke o akumulatoru.',
        partnerId: partId,
        productList: productsNames[0],
        partnerInfo: globalPartnerInfo,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getRecordNumber = (req, res, next) => {
  Record.findOne({ order: [['createdAt', 'DESC']] })
    .then((lastRecord) => {
      let godina = new Date(Date());
      godina = godina.getFullYear().toString().slice(2, 4);
      if (!lastRecord) {
        let brojZapisnika = `1/${godina}`;
        return res.send(JSON.stringify({ brojZapisnika: brojZapisnika }));
      }
      let brojZapisnika = lastRecord.brojZapisnika.split('/')[0];
      brojZapisnika = +brojZapisnika + 1;
      brojZapisnika = `${brojZapisnika}/${godina}`;
      res.send(JSON.stringify({ brojZapisnika: brojZapisnika }));
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.batteryInfoAdd = (req, res, next) => {
  res.redirect('/add-complaint/battery-condition');
};

exports.batteryConditionInput = (req, res, next) => {
  res.render('employee/add-complaint/battery-condition', {
    pageTitle: 'Informacije o stanju baterije',
    path: 'Mora nesto da stoji',
    message: 'U ovom koraku unosimo stanje baterije na prijemu.',
  });
};

exports.batteryConditionAdd = (req, res, next) => {
  res.redirect(`/add-complaint/note-and-advice`); //Izmeniti rutu, nije potreban recordId
};

exports.noteAndAdvice = (req, res, next) => {
  res.render('employee/add-complaint/note-and-advice', {
    pageTitle: 'Napomena i savet',
    path: 'Mora nesto da stoji',
  });
};

exports.noteAndAdviceAdd = async (req, res, next) => {
  const recordData = JSON.parse(req.body.recordData);
  const partnerPIB = recordData.pib;
  const partnerData = recordData.partnerData;
  const batteryInfo = recordData.batteryInfo;
  const batteryCondition = recordData.batteryCondition;

  let partner = await Partner.findOne({ where: { PIB: partnerPIB } });
  if (!partner) {
    partner = await req.user.createMypartner({
      PIB: partnerData.code,
      ime: partnerData.name,
      adresa: partnerData.address,
      postanskibroj: partnerData.zip,
      grad: partnerData.city,
      email: partnerData.email,
    });
  }
  const record = await partner.createRecord({
    datumPrijema: batteryInfo.dateOfComplaint,
    brojPrijema: batteryInfo.receiveNumber,
    datumZapisnika: batteryInfo.resolveDate,
    brojZapisnika: batteryInfo.reportNumber,
    tipAkumulatora: batteryInfo.batteryType,
    brojAkumulatora: batteryInfo.batteryNumber,
    brojRacuna: batteryInfo.checkNumber,
    tipVozila: batteryInfo.vehicleType,
  });
  const additionalInfo = await record.createAdditionalinfo({
    fizickaOstecenja: batteryCondition.fizickaOstecenja,
    prljavaZamascena: batteryCondition.prljavaZamascena,
    stanjeStubica: batteryCondition.stanjeStubica,
    preNapon: batteryCondition.preServisa.preNapon,
    preNapunjenost: batteryCondition.preServisa.preNapunjenost,
    preGustCel1: batteryCondition.preServisa.preGustCel1,
    preNivoElCel1: batteryCondition.preServisa.preNivoElCel1,
    preZamucenaCel1: batteryCondition.preServisa.preZamucenaCel1,
    preGustCel2: batteryCondition.preServisa.preGustCel2,
    preNivoElCel2: batteryCondition.preServisa.preNivoElCel2,
    preZamucenaCel2: batteryCondition.preServisa.preZamucenaCel2,
    preGustCel3: batteryCondition.preServisa.preGustCel3,
    preNivoElCel3: batteryCondition.preServisa.preNivoElCel3,
    preZamucenaCel3: batteryCondition.preServisa.preZamucenaCel3,
    preGustCel4: batteryCondition.preServisa.preGustCel4,
    preNivoElCel4: batteryCondition.preServisa.preNivoElCel4,
    preZamucenaCel4: batteryCondition.preServisa.preZamucenaCel4,
    preGustCel5: batteryCondition.preServisa.preGustCel5,
    preNivoElCel5: batteryCondition.preServisa.preNivoElCel5,
    preZamucenaCel5: batteryCondition.preServisa.preZamucenaCel5,
    preGustCel6: batteryCondition.preServisa.preGustCel6,
    preNivoElCel6: batteryCondition.preServisa.preNivoElCel6,
    preZamucenaCel6: batteryCondition.preServisa.preZamucenaCel6,
  });
  const additionalinfoAfter = await record.createAdditionalinfoafter({
    posleNapon: batteryCondition.posleServisa.posleNapon,
    posleNapunjenost: batteryCondition.posleServisa.posleNapunjenost,
    posleGustCel1: batteryCondition.posleServisa.posleGustCel1,
    posleNivoElCel1: batteryCondition.posleServisa.posleNivoElCel1,
    posleZamucenaCel1: batteryCondition.posleServisa.posleZamucenaCel1,
    posleGustCel2: batteryCondition.posleServisa.posleGustCel2,
    posleNivoElCel2: batteryCondition.posleServisa.posleNivoElCel2,
    posleZamucenaCel2: batteryCondition.posleServisa.posleZamucenaCel2,
    posleGustCel3: batteryCondition.posleServisa.posleGustCel3,
    posleNivoElCel3: batteryCondition.posleServisa.posleNivoElCel3,
    posleZamucenaCel3: batteryCondition.posleServisa.posleZamucenaCel3,
    posleGustCel4: batteryCondition.posleServisa.posleGustCel4,
    posleNivoElCel4: batteryCondition.posleServisa.posleNivoElCel4,
    posleZamucenaCel4: batteryCondition.posleServisa.posleZamucenaCel4,
    posleGustCel5: batteryCondition.posleServisa.posleGustCel5,
    posleNivoElCel5: batteryCondition.posleServisa.posleNivoElCel5,
    posleZamucenaCel5: batteryCondition.posleServisa.posleZamucenaCel5,
    posleGustCel6: batteryCondition.posleServisa.posleGustCel6,
    posleNivoElCel6: batteryCondition.posleServisa.posleNivoElCel6,
    posleZamucenaCel6: batteryCondition.posleServisa.posleZamucenaCel6,
  });

  const noteAndAdvice = await record.createNoteAndAdvice({
    note: req.body.noteforreport,
    picture1: req.files[0] ? req.files[0].path : null,
    picture2: req.files[1] ? req.files[1].path : null,
    picture3: req.files[2] ? req.files[2].path : null,
    picture4: req.files[3] ? req.files[3].path : null,
    picture5: req.files[4] ? req.files[4].path : null,
    picture6: req.files[5] ? req.files[5].path : null,
    picture7: req.files[6] ? req.files[6].path : null,
    picture8: req.files[7] ? req.files[7].path : null,
  });

  const zapisnik = await pdfZapisnik.createPDF(record.id);

  const odluka = await pdfOdluka.createPDF(record.id);

  for (let i = 0; i < 7; i++) {
    if (req.files[i]) {
      jimp
        .read(req.files[i].path)
        .then((image) => {
          image.resize(jimp.AUTO, 800).quality(75).write(req.files[i].path);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  res.send(JSON.stringify({success: true}));
};
