///////////////

const DOMAIN_URL_FRONT = 'http://localhost:3000';

if (!sessionStorage.pib) {
  location.replace(`${DOMAIN_URL_FRONT}/add-complaint/add-partner`);
}

/////////////////

const submitBtn = document.getElementById('add-record');

const formTag = document.getElementById('multipart-form-data');
const formData = new FormData(formTag);

async function sendHttpRequest(method, url, data) {
  const csrf = document.querySelector('[name=_csrf]').value;
  const sendInfo = await fetch(url, {
    method: method,
    body: data,
    headers: {
      Accept: 'application/json',
      'csrf-token': csrf,
    },
  });
  const message = await sendInfo.json();

  if (message.success) {
    location.replace(`${DOMAIN_URL_FRONT}/for-verification`);
  }
}

async function sendData(data) {
  await sendHttpRequest(
    'POST',
    `${DOMAIN_URL_FRONT}/add-complaint/note-and-advice`,
    data
  );
}

const objStore = {
  pib: JSON.parse(sessionStorage.getItem('pib')),
  partnerData: JSON.parse(sessionStorage.getItem('partnerData')),
  batteryInfo: JSON.parse(sessionStorage.getItem('batteryInfo')),
  batteryCondition: JSON.parse(sessionStorage.getItem('batteryCondition')),
};

submitBtn.addEventListener('click', (event) => {
  event.preventDefault();

  sessionStorage.removeItem('pib');
  sessionStorage.removeItem('partnerData');
  sessionStorage.removeItem('batteryInfo');
  sessionStorage.removeItem('batteryCondition');

  const formTag = document.getElementById('multipart-form-data');
  const formData = new FormData(formTag);
  formData.append('recordData', JSON.stringify(objStore));
  sendData(formData);
});
