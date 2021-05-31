///////////////

const DOMAIN_URL_FRONT = 'http://localhost:3000';

if(!sessionStorage.pib) {
  location.replace(`${DOMAIN_URL_FRONT}/add-complaint/add-partner`);
}

/////////////////

const physicalDamage = document.getElementById('physical-damage');
const dirtCondition = document.getElementById('dirt-condition');
const contactDamage = document.getElementById('contact-damage');

// -------------> Before-service-measure.ejs <-------------
const voltageBefore = document.getElementById('voltage-before');
const chargeBefore = document.getElementById('charge-before');
//Cell - 1
const fdb1 = document.getElementById('fluid-density-before-1');
const llb1 = document.getElementById('liquid-level-before-1');
const tcb1 = document.getElementById('turbid-cell-before-1');
//Cell - 2
const fdb2 = document.getElementById('fluid-density-before-2');
const llb2 = document.getElementById('liquid-level-before-2');
const tcb2 = document.getElementById('turbid-cell-before-2');
//Cell - 3
const fdb3 = document.getElementById('fluid-density-before-3');
const llb3 = document.getElementById('liquid-level-before-3');
const tcb3 = document.getElementById('turbid-cell-before-3');
//Cell - 4
const fdb4 = document.getElementById('fluid-density-before-4');
const llb4 = document.getElementById('liquid-level-before-4');
const tcb4 = document.getElementById('turbid-cell-before-4');
//Cell - 5
const fdb5 = document.getElementById('fluid-density-before-5');
const llb5 = document.getElementById('liquid-level-before-5');
const tcb5 = document.getElementById('turbid-cell-before-5');
//Cell - 6
const fdb6 = document.getElementById('fluid-density-before-6');
const llb6 = document.getElementById('liquid-level-before-6');
const tcb6 = document.getElementById('turbid-cell-before-6');

// -------------> After-service-measure.ejs <-------------
const voltageAfter = document.getElementById('voltage-after');
const chargeAfter = document.getElementById('charge-after');
//Cell - 1
const fda1 = document.getElementById('fluid-density-after-1');
const lla1 = document.getElementById('liquid-level-after-1');
const tca1 = document.getElementById('turbid-cell-after-1');
//Cell - 2
const fda2 = document.getElementById('fluid-density-after-2');
const lla2 = document.getElementById('liquid-level-after-2');
const tca2 = document.getElementById('turbid-cell-after-2');
//Cell - 3
const fda3 = document.getElementById('fluid-density-after-3');
const lla3 = document.getElementById('liquid-level-after-3');
const tca3 = document.getElementById('turbid-cell-after-3');
//Cell - 4
const fda4 = document.getElementById('fluid-density-after-4');
const lla4 = document.getElementById('liquid-level-after-4');
const tca4 = document.getElementById('turbid-cell-after-4');
//Cell - 5
const fda5 = document.getElementById('fluid-density-after-5');
const lla5 = document.getElementById('liquid-level-after-5');
const tca5 = document.getElementById('turbid-cell-after-5');
//Cell - 6
const fda6 = document.getElementById('fluid-density-after-6');
const lla6 = document.getElementById('liquid-level-after-6');
const tca6 = document.getElementById('turbid-cell-after-6');

const submitBtn = document.getElementById('add-battery-info');

submitBtn.addEventListener('click', (event) => {
  const objStore = {
    fizickaOstecenja: physicalDamage.value,
    prljavaZamascena: dirtCondition.value,
    stanjeStubica: contactDamage.value,
    preServisa: {
      preNapon: voltageBefore.value,
      preNapunjenost: chargeBefore.value,
      preGustCel1: fdb1.value,
      preNivoElCel1: llb1.value,
      preZamucenaCel1: tcb1.value,
      preGustCel2: fdb2.value,
      preNivoElCel2: llb2.value,
      preZamucenaCel2: tcb2.value,
      preGustCel3: fdb3.value,
      preNivoElCel3: llb3.value,
      preZamucenaCel3: tcb3.value,
      preGustCel4: fdb4.value,
      preNivoElCel4: llb4.value,
      preZamucenaCel4: tcb4.value,
      preGustCel5: fdb5.value,
      preNivoElCel5: llb5.value,
      preZamucenaCel5: tcb5.value,
      preGustCel6: fdb6.value,
      preNivoElCel6: llb6.value,
      preZamucenaCel6: tcb6.value,
    },
    posleServisa: {
      posleNapon: voltageAfter.value,
      posleNapunjenost: chargeAfter.value,
      posleGustCel1: fda1.value,
      posleNivoElCel1: lla1.value,
      posleZamucenaCel1: tca1.value,
      posleGustCel2: fda2.value,
      posleNivoElCel2: lla2.value,
      posleZamucenaCel2: tca2.value,
      posleGustCel3: fda3.value,
      posleNivoElCel3: lla3.value,
      posleZamucenaCel3: tca3.value,
      posleGustCel4: fda4.value,
      posleNivoElCel4: lla4.value,
      posleZamucenaCel4: tca4.value,
      posleGustCel5: fda5.value,
      posleNivoElCel5: lla5.value,
      posleZamucenaCel5: tca5.value,
      posleGustCel6: fda6.value,
      posleNivoElCel6: lla6.value,
      posleZamucenaCel6: tca6.value,
    },
  };
  sessionStorage.setItem('batteryCondition', JSON.stringify(objStore));
});
