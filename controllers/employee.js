const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');
const sendGridTransports = require('nodemailer-sendgrid-transport');

const Partner = require('../models/partner');
const Record = require('../models/complaint-record');
const pdfOdluka = require('../util/createpdf');
const pdfZapisnik = require('../util/createpdf-zapisnik');

const transporter = nodemailer.createTransport(
  sendGridTransports({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.complaintsList = (req, res, next) => {
  Record.findAll({
    include: ['mypartner', 'noteAndAdvice'],
    order: [['createdAt', 'DESC']],
    limit: 20,
    where: {
      status: 'finished',
    },
  })
    .then((records) => {
      res.render('employee/complaints-list', {
        pageTitle: 'Lista reklamacija',
        path: '/complaints-list',
        message: 'POSLEDNJIH 20 REKLAMACIJA',
        records: records,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.complaintSearch = (req, res, next) => {
  const recordNumber = req.body.recordsearch;
  Record.findAll({
    where: { brojZapisnika: recordNumber },
    include: ['mypartner'],
  })
    .then((records) => {
      const record = records[0];
      res.render('employee/complaint-search', {
        pageTitle: `Zapisnika broj: ${record.brojZapisnika}`,
        path: 'Nesto',
        message: 'Message',
        record: record,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.renderComplaints = (req, res, next) => {
  Record.findAll({
    where: { status: 'unverified' },
    include: ['mypartner', 'noteAndAdvice'],
    order: [['createdAt', 'ASC']],
  })
    .then((records) => {
      res.render('admin/for-verification', {
        pageTitle: 'Za verifikaciju',
        path: '/for-verification',
        message: 'Message',
        records: records,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.verifyRecord = (req, res, next) => {
  const recordId = req.params.recordId;
  Record.findOne({ where: { id: recordId } })
    .then((record) => {
      record.status = 'verified';
      return record.save();
    })
    .then((result) => {
      res.redirect('/for-verification');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.renderVerified = (req, res, next) => {
  Record.findAll({
    where: { status: 'verified' },
    include: ['mypartner', 'noteAndAdvice'],
    order: [['createdAt', 'ASC']],
  })
    .then((records) => {
      res.render('admin/verified', {
        pageTitle: 'Odobrene reklamacije',
        path: '/verified',
        message: 'Message',
        records: records,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.sendToCustomer = (req, res, next) => {
  const recordId = req.params.recordId;

  Record.findByPk(recordId, {
    include: ['mypartner', 'noteAndAdvice'],
  })
    .then((record) => {
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

      const complaintRecrodName = `Zapisnik_${record.brojZapisnika.replace(
        '/',
        '-'
      )}.pdf`;
      const complaintRecordPath = path.join(
        'public',
        'Data',
        'complaints',
        complaintRecrodName
      );

      const message = {
        to: record.mypartner.email,
        // from: 'servis@motoplus.rs',
        from: 'igor.milovanovic13@icloud.com',
        bcc: ['igor@motoplus.rs', 'servis@motoplus.rs'],
        subject: 'Odluka o reklamaciji',
        attachments: [
          {
            filename: complaintDecisionName,
            path: complaintDecisionPath,
          },
          // {
          //   filename: complaintRecrodName,
          //   path: complaintRecordPath,
          // },
          {
            filename: 'moto-plus-logo-bez-pozadine-do_FOR_MAIL.png',
            path: path.join(
              'Images',
              'moto-plus-logo-bez-pozadine-do_FOR_MAIL.png'
            ),
            cid: 'motopluslogo_foremail',
          },
        ],
        html: `<!DOCTYPE html><html>
        <head>
          <meta http-equiv="content-type" content="text/html; charset="utf8">
        </head>
        <body>
          Poštovani,<br>
          <br>
          U prilogu se nalazi odluka o reklamaciji kao i zapisnik sa brojem: ${record.brojZapisnika}<br>
          <div class="moz-signature">
            <p>Srdačan pozdrav,</p>
            <span><b>Predrag Đorđević</b></span><br>
            <span>Servis akumulatora</span><br>
            <img moz-do-not-send="false" style="margin-left:-13px;"
              src="cid:motopluslogo_foremail"
              alt="Moto Plus d.o.o." width="208" height="80"><br>
            <span><b>Moto Plus d.o.o.</b></span><br>
            <span>Ulica: Marka Zagorca 1b</span><br>
            <span>Grad: 34113, Kragujevac</span><br>
            <span>Mobilni: <b><a href="tel:+38163570218" style="color:black; text-decoration:none;">063/570-218</a></b></span><br>
            <span>Telefon: <b><a href="tel:+38134385350" style="color:black; text-decoration:none;">034/385-350</a></b></span><br>
            <span>E-mail: <a href="mailto:servis@motoplus.rs" style="text-decoration:none;"><b>servis@motoplus.rs</b></a></span><br>
            <span>Website: <a href="http://motoplus.rs" style="text-decoration:none;"><b>motoplus.rs</b></a></span>
          </div>
        </body>
      </html>`,
      };
      const photos = [];
      for (let i = 0; i < 7; i++) {
        let pic = record.noteAndAdvice['picture' + (i + 1)];
        if (pic !== 'null') {
          photos.push(pic);
        }
      }

      let i = 1;
      photos.forEach((picturePath) => {
        if (picturePath) {
          message.attachments.push({
            filename: `slika_${i++}.jpg`,
            path: picturePath,
          });
        }
      });

      record.status = 'finished';
      record.save();
      return transporter.sendMail(message);
    })
    .then((result) => {
      res.redirect('/verified');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.removeComplaint = (req, res, next) => {
  const recordId = req.params.recordId;
  Record.findByPk(recordId, {
    include: ['mypartner', 'noteAndAdvice'],
  })
    .then((record) => {
      const filePath_odluka = `public/Data/complaint-decisions/Odluka_o_reklamaciji_${record.brojZapisnika.replace(
        '/',
        '-'
      )}.pdf`;
      const filePath_zapisnik = `public/Data/complaints/Zapisnik_${record.brojZapisnika.replace(
        '/',
        '-'
      )}.pdf`;
      fs.unlink(filePath_odluka, (err) => {
        if (err) {
          console.log(err);
        }
      });
      fs.unlink(filePath_zapisnik, (err) => {
        if (err) {
          console.log(err);
        }
      });
      for (let i = 1; i < 9; i++) {
        if (record.noteAndAdvice['picture' + i] !== null) {
          const filePathPicture = `${record.noteAndAdvice['picture' + i]}`;
          fs.unlink(filePathPicture, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }
      return record;
    })
    .then((record) => {
      record.destroy();
      res.redirect('/for-verification');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.regeneratePDF = (req, res, next) => {
  const recordId = req.body.recordId;
  const modifiedServicerNote = req.body.modifiedServicerNote;
  const deniedApproved = req.body.deniedApproved;
  Record.findByPk(recordId, {
    include: [
      'mypartner',
      'additionalinfo',
      'additionalinfoafter',
      'noteAndAdvice',
    ],
  })
    .then((record) => {
      if (!record) {
        return next(new Error('No record found!'));
      }
      record.noteAndAdvice.note = modifiedServicerNote;
      record.decision = deniedApproved;
      record.noteAndAdvice.save();
      return record.save();
    })
    .then((record) => {
      pdfZapisnik.createPDF(recordId);
      pdfOdluka.createPDF(recordId);
      return record;
    })
    .then((record) => {
      res.send(
        JSON.stringify({
          message: 'Zapisnik i odluka azurirani!',
          success: true,
        })
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
