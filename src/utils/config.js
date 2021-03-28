function getDevStatus() {
  return process.env.NODE_ENV !== 'production';
}

function getBaseDomain() {
  let BASE = '';

  if (getDevStatus()) {
    BASE = 'http://localhost:3000';
  }

  return BASE;
}

module.exports = {
  DEV: getDevStatus(),
  BASE_DOMAIN: getBaseDomain(),
  PORT: process.env.PORT || 3000
};
