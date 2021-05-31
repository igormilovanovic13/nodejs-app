///////////////

const DOMAIN_URL_FRONT = 'http://localhost:3000';

if(!sessionStorage.pib) {
  location.replace(`${DOMAIN_URL_FRONT}/add-complaint/add-partner`);
}

/////////////////

const dateField = document.getElementById('battery-resolving-date');
const reportNumber = document.getElementById('report-number');
const dateOfComplaint = document.getElementById('battery-date-of-complaint');
const receiveNumber = document.getElementById('receive-number');
const dateOfPurchase = document.getElementById('battery-date-of-purchase');
const checkNumber = document.getElementById('check-number');
const vehicleType = document.getElementById('vehicle-type');
const batteryType = document.getElementById('battery-type');
const batteryNumber = document.getElementById('battery-number');

const csrf = document.querySelector('[name=_csrf]').value;

const submitBtn = document.getElementById('add-battery-info');


async function sendHttpRequest(method, url, data) {
  const getData = await fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'csrf-token': csrf,
    },
  });
  const serverData = await getData.json();
  reportNumber.value = await serverData.brojZapisnika;
}

async function sendData(data) {
  const forwardData = {
    data: data,
  };

  const broj = await sendHttpRequest(
    'POST',
    `${DOMAIN_URL_FRONT}/add-complaint/ajax-get-record-number`,
    forwardData
  );
  return broj;
}

sendData('Some data!');

///////////////////////

let date = new Date();
date = date.toLocaleString('pl-PL', {
  timeZone: 'UTC',
});
date = date.toString().split(',')[0];
date = date.split('.');

if (date[0] < 10) {
  date[0] = `0${date[0]}`;
}

const formatedDate = `${date[2]}-${date[1]}-${date[0]}`;

dateField.value = formatedDate;

///////////////////////

submitBtn.addEventListener('click', (event) => {
  const objStore = {
    resolveDate: dateField.value,
    reportNumber: reportNumber.value,
    dateOfComplaint: dateOfComplaint.value,
    receiveNumber: receiveNumber.value,
    dateOfPurchase: dateOfPurchase.value,
    checkNumber: checkNumber.value,
    vehicleType: vehicleType.value,
    batteryType: batteryType.value,
    batteryNumber: batteryNumber.value,
  };
  sessionStorage.setItem('batteryInfo' , JSON.stringify(objStore));
});
