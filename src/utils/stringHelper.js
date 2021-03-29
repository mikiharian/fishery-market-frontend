const isPhoneNumber = (text) => {
  const regex = /[0-9 \-()+]+$/;

  return regex.test(text);
};

const isNumberOnly = (text) => {
  const numberRegex = /^\d+$/;

  if (text && numberRegex.test(text)) return true;
  return false;
};

const formatCurrency = (x = 0, withCurrency) => {
  if (x === null) return '-';
  let number = x;
  if (typeof number === 'number') {
    number = Math.round(x);
  }
  let finalNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (withCurrency) finalNumber = 'Rp'.concat(finalNumber);// .concat(',00');
  return finalNumber;
};

module.exports = {
  isNumberOnly,
  isPhoneNumber,
  formatCurrency
};
