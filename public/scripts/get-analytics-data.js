const csrf = document.querySelector('[name=_csrf]').value;
const section = document.getElementById('monthly-sales');

async function sendHttpRequest(method, url, data) {
  const getData = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'csrf-token': csrf,
    },
  });

  const serverData = await getData.json();
  const numberOfMonths = await serverData.currentMonth;

  showOnPage(serverData, numberOfMonths);
}

function showOnPage(serverData, numberOfMonths) {
  const newList = document.createElement('ul');
  newList.className = 'monthly-sales-list';

  const yearParagraph = document.createElement('p');
  yearParagraph.className = 'year-paragraph';
  yearParagraph.textContent = `${serverData.year}`;
  section.querySelector('div').append(yearParagraph);

  const totalQty = document.createElement('span');
  totalQty.className = 'total-qty';
  totalQty.textContent = `Ukupno prodato za ${serverData.year}. godinu: ${serverData.totalQty}`;
  section.querySelector('div').append(totalQty);

  serverData.monthlySales.forEach((month) => {
    const newListElem = document.createElement('li');
    newListElem.className = 'monthly-sales-list-item';
    newListElem.innerHTML = `
        <span>${month.month}</span>
        <span>${month.qty}</span>
        `;
    newList.append(newListElem);
  });
  section.querySelector('div').append(newList);
}

async function getAnalytics(data, route) {
  const forwardData = {
    currentDate: data,
  };

  await sendHttpRequest('POST', route, forwardData);
}

async function orderExecutionGuarantee() {
  const date = new Date();
  const DOMAIN_URL_FRONT = 'http://localhost:3000';
  await getAnalytics(date, `${DOMAIN_URL_FRONT}/analytics`);

  await getAnalytics('Some data!', `${DOMAIN_URL_FRONT}/analytics/2020-01-01`);

  await getAnalytics('Some data!', `${DOMAIN_URL_FRONT}/analytics/2019-01-01`);
}

orderExecutionGuarantee();
