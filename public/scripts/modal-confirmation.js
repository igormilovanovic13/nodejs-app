const backdrop = document.getElementById('backdrop');
const deleteBtns = document.querySelectorAll('.delete-record') || null;
const approveBtns = document.querySelectorAll('.approve-record') || null;
const sendBtns = document.querySelectorAll('.send-btn') || null;

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

const showModal = (requiredInfo) => {
  const main = document.getElementById('main');
  const template = document.getElementsByTagName('template')[0];
  const clone = template.content.cloneNode(true);
  main.appendChild(clone);

  const addModal = document.getElementById('add-modal');
  addModal.querySelector('.modal-title').textContent = requiredInfo.headerText;
  addModal.querySelector('.question').textContent = requiredInfo.bodyText;
  addModal.querySelector(
    '.record-number'
  ).textContent = `Broj zapisnika: ${requiredInfo.recordNumber}`;
  addModal.querySelector('.btn--success').textContent = requiredInfo.btnText;
  addModal.querySelector('.btn--success').classList.add(requiredInfo.btnColor);
  addModal.querySelector('.btn--success').setAttribute('href', requiredInfo.getReqURL);

  addModal.classList.toggle('visible');
  toggleBackdrop();

  const cancelAddButton = addModal.querySelector('.btn--passive');
  cancelAddButton.addEventListener('click', cancelAddModal);
  backdrop.addEventListener('click', cancelAddModal);
};

if(deleteBtns) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const recordId = btn.getAttribute('data-record-id');
      const requiredInfo = {
        recordId: recordId,
        recordNumber: btn.getAttribute('data-record-number'),
        headerText: 'BRISANJE ZAPISNIKA!',
        bodyText: 'Da li ste sigurni da želite da obrišete zapisnik sa ovim brojem?',
        btnText: 'Obriši',
        getReqURL: `/remove-complaint/${recordId}`,
        btnColor: 'btn-danger',
      };
      showModal(requiredInfo);
    });
  });
}

if(approveBtns) {
  approveBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const recordId = btn.getAttribute('data-record-id');
      const requiredInfo = {
        recordId: recordId,
        recordNumber: btn.getAttribute('data-record-number'),
        headerText: 'ODOBRAVANJE ZAPISNIKA!',
        bodyText: 'Da li ste sigurni da želite da odobrite zapisnik sa ovim brojem?',
        btnText: 'Odobri',
        getReqURL: `/for-verification/${recordId}`,
        btnColor: 'btn-success',
      };
      showModal(requiredInfo);
    });
  });
}

if(sendBtns) {
  sendBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const recordId = btn.getAttribute('data-record-id');
      const requiredInfo = {
        recordId: recordId,
        recordNumber: btn.getAttribute('data-record-number'),
        headerText: 'SLANJE KUPCU NA E-Mail',
        bodyText: 'Da li ste sigurni da želite da pošaljete odluku sa ovim brojem?',
        btnText: 'Pošalji',
        getReqURL: `/verified/${recordId}`,
        btnColor: 'btn-success',
      };
      showModal(requiredInfo);
    })
  });
}

