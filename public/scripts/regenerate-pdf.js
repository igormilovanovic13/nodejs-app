const loaderDiv = document.querySelector('.loader');
const backdropLoader = document.querySelector('.background-backdrop');

async function sendHttpRequest(method, url, data) {
  const csrf = document.querySelector('[name=_csrf]').value;
  const sendInfo = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'csrf-token': csrf,
    },
  });
  const message = await sendInfo.json();
  if(message.success) {
    loaderDiv.classList.remove('show-loader');
    backdropLoader.classList.remove('visible');
  }
}

async function sendData(data) {
  const DOMAIN_URL_FRONT = 'http://localhost:3000';
  await sendHttpRequest('POST', `${DOMAIN_URL_FRONT}/regenerate-pdf`, data);
}

const listItems = document.querySelectorAll('.record__item');
if (listItems.length > 0) {
  listItems.forEach((items) => {
    const item = items.querySelector('.update-record');
    item.addEventListener('click', () => {
      const recordId = items
        .querySelector('.update-record')
        .getAttribute('data-record-id');
      const modifiedServicerNote = items.querySelector('.noteAndAdvice').value;
      const deniedApproved = items.querySelector('.select-decision').value;
      const dataObj = {
        recordId: recordId,
        modifiedServicerNote: modifiedServicerNote,
        deniedApproved: deniedApproved,
      };
      sendData(dataObj);
      loaderDiv.classList.add('show-loader');
      backdropLoader.classList.add('visible');
    });
  });
}
