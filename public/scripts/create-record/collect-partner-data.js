const backdrop = document.getElementById('backdrop');
const addModalButton = document.querySelector('#ajax-btn');
const main = document.getElementById('main');

const pibValue = document.getElementById('partnerInput');

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

const cancelAddModal = () => {
  const addModal = document.getElementById('add-modal');
  addModal.classList.toggle('visible');
  addModal.parentNode.removeChild(addModal);
  toggleBackdrop();
};

const backdropClickHandler = () => {
  cancelAddModal();
};

const toggleModal = async () => {
  const csrf = document.querySelector('[name=_csrf]').value;
  const partnerData = await sendPIB(pibValue.value || 999999999, csrf);

  if (partnerData.failed) {
    const template = document.getElementsByTagName('template')[1];
    const clone = template.content.cloneNode(true);
    main.appendChild(clone);

    const addModal = document.getElementById('add-modal');
    addModal.querySelector(
      '#partnerPIB'
    ).textContent = `PIB: ${pibValue.value}`;
    addModal.classList.toggle('visible');
    toggleBackdrop();

    const cancelAddButton = addModal.querySelector('.btn--passive');
    cancelAddButton.addEventListener('click', cancelAddModal);
    backdrop.addEventListener('click', cancelAddModal);
  } else {
    const template = document.getElementsByTagName('template')[0];
    const clone = template.content.cloneNode(true);
    main.appendChild(clone);

    const addModal = document.getElementById('add-modal');
    addModal.querySelector('[name=partnerPIB]').value = partnerData.code;
    addModal.querySelector('#ime-partnera').value = partnerData.name;
    addModal.querySelector('#adresa-partnera').value = partnerData.address;
    addModal.querySelector(
      '#grad-partnera'
    ).value = `${partnerData.zip}, ${partnerData.city}`;
    addModal.querySelector('#email-partnera').value = partnerData.email;
    collectPartnerData(partnerData);
    addModal.classList.toggle('visible');
    toggleBackdrop();

    const cancelAddButton = addModal.querySelector('.btn--passive');
    cancelAddButton.addEventListener('click', cancelAddModal);
    backdrop.addEventListener('click', cancelAddModal);
  }
};

addModalButton.addEventListener('click', toggleModal);

async function sendHttpRequest(method, url, partnerPIB, token) {
  const getPartner = await fetch(url, {
    method: method,
    body: JSON.stringify(partnerPIB),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'csrf-token': token,
    },
  });
  const partnerData = await getPartner.json();
  return partnerData;
}

async function sendPIB(pib, token) {
  const DOMAIN_URL_FRONT = 'http://localhost:3000';
  const partnerPIB = {
    pib: pib,
  };

  const partnerData = await sendHttpRequest(
    'POST',
    `${DOMAIN_URL_FRONT}/add-complaint/ajax-partner-data`,
    partnerPIB,
    token
  );

  ////////////////////////
  sessionStorage.setItem('pib', pib);
  ///////////////////////////////

  return partnerData;
}

function collectPartnerData(partnerData) {
  const submitBtn = document.getElementById('add-partner');
  submitBtn.addEventListener('click', () => {
    const emailChanged = document.getElementById('email-partnera').value;
    const { address, city, code, email, name, zip } = partnerData;
    const storeData = {
      address: address,
      city: city,
      code: code,
      email: email,
      name: name,
      zip: zip,
    };
    if (storeData.email.toString() !== emailChanged.toString()) {
      storeData.email = emailChanged;
    }
    sessionStorage.setItem('partnerData', JSON.stringify(storeData));
  });
}
