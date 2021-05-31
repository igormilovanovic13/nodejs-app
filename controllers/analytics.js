const sequelize = require('../util/database');

// const sequelize = require('../util/database_old');

// const pool = require('../util/database_old');

const monthsArray = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Maj',
  'Jun',
  'Jul',
  'Avg',
  'Sep',
  'Okt',
  'Nov',
  'Dec',
];

exports.getAnalyticsPage = (req, res, next) => {
  res.render('employee/analytics', {
    pageTitle: 'Analitika',
    path: '/analytics',
    message: 'Analitika',
  });
};

exports.getSalesData = async (req, res, next) => {
  let currentDate = req.body.currentDate.split('-');
  const currentYear = currentDate[0];
  const currentMonth = currentDate[1];
  const currentDay = currentDate[2].split('T')[0];
  const monthlySales = [];
  let totalQty = 0;

  for (let i = 1; i <= currentMonth; i++) {
    let stringMonth = i < 10 ? `0${i}` : `${i}`;
    let stringNextMonth = i + 1;
    stringNextMonth =
      stringNextMonth < 10 ? `0${stringNextMonth}` : `${stringNextMonth}`;
    let nextMonth;
    let equals;
    const month = `${currentYear}-${stringMonth}-01`;
    if (i < currentMonth) {
      nextMonth = `${currentYear}-${stringNextMonth}-01`;
      equals = '';
    } else {
      nextMonth = `${currentYear}-${stringMonth}-${currentDay}`;
      equals = '=';
    }

    const monthlyBatteriesSold = await sequelize
      .query(
        `
          SELECT
          pr.productid AS productid,
          pr.name AS name,
          pr.code AS code,
          SUM(docit.quantity) AS qty
          FROM document AS doc
            LEFT JOIN documentitem AS docit ON docit.documentid=doc.documentid
            LEFT JOIN product AS pr ON docit.productid=pr.productid
          WHERE
            doc.documenttype IN ('R', 'M') AND
            doc.documentdate>='${month}' AND
            doc.documentdate<${equals}'${nextMonth}' AND
            (pr.manufname='Dynamic' OR pr.manufname='Midac')
          GROUP BY
            productid
        `
      )
      .then((result) => {
        let qty = 0;
        const products = result[0];
        products.forEach((product) => {
          qty += product.qty;
        });
        totalQty += qty;
        monthlySales.push({ month: monthsArray[+stringMonth - 1], qty: qty });
        if (i === +currentMonth) {
          res.send(
            JSON.stringify({
              year: currentYear,
              month: currentMonth,
              monthlySales: monthlySales,
              totalQty: totalQty,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getSalesDataPastYear = async (req, res, next) => {
  let pastDate = req.params.pastDate.split('-');
  const pastYear = pastDate[0];
  const pastMonth = pastDate[1];
  const pastDay = pastDate[2];
  const monthlySales = [];
  let totalQty = 0;

  for (let i = 1; i <= 12; i++) {
    let stringMonth = i < 10 ? `0${i}` : `${i}`;
    let stringNextMonth = i + 1;
    stringNextMonth =
      stringNextMonth < 10 ? `0${stringNextMonth}` : `${stringNextMonth}`;
    let nextMonth;
    let equals;
    const month = `${pastYear}-${stringMonth}-01`;
    if (i < 12) {
      nextMonth = `${pastYear}-${stringNextMonth}-01`;
      equals = '';
    } else {
      nextMonth = `${pastYear}-${stringMonth}-31`;
      equals = '=';
    }
    const monthlyBatteriesSold = await sequelize
      .query(
        `
          SELECT
          pr.productid AS productid,
          pr.name AS name,
          pr.code AS code,
          SUM(docit.quantity) AS qty
          FROM document AS doc
            LEFT JOIN documentitem AS docit ON docit.documentid=doc.documentid
            LEFT JOIN product AS pr ON docit.productid=pr.productid
          WHERE
            doc.documenttype IN ('R', 'M') AND
            doc.documentdate>='${month}' AND
            doc.documentdate<${equals}'${nextMonth}' AND
            (pr.manufname='Dynamic' OR pr.manufname='Midac')
          GROUP BY
            productid
        `
      )
      .then((result) => {
        let qty = 0;
        const products = result[0];
        products.forEach((product) => {
          qty += product.qty;
        });
        totalQty += qty;
        monthlySales.push({ month: monthsArray[+stringMonth - 1], qty: qty });
        if (i === 12) {
          res.send(
            JSON.stringify({
              year: pastYear,
              month: 12,
              monthlySales: monthlySales,
              totalQty: totalQty,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
