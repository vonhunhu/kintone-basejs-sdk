module.exports = {
  PASSWORD_AUTH: 'X-Cybozu-Authorization',
  API_TOKEN: 'X-Cybozu-API-Token',
  DOMAIN: 'sample.cybozu.com',
  USERNAME: 'your_username',
  PASSWORD: 'your_password',
  PROXY_HOST: 'your_proxy',
  PROXY_PORT: '3128',
  GUEST_SPACEID: 'your_guest_space_ID',
  getPasswordAuth: (userName, password) => {
    return Buffer.from(userName + ':' + password).toString('base64');
  },
  generateRecord: (number, inputRecord) => {
    const items = [];
    if (inputRecord.hasOwnProperty('id')) {
        for (let i = 0; i < number; i++) {
            items.push({ ...inputRecord })
            items[i].id = i;
        }
    }
    else if(typeof inputRecord === 'object'){
        for (let i = 0; i < number; i++) {
            items.push({ ...inputRecord })
        }
    }
    else{
        for (let i = 0; i < number; i++) {
            items.push({ ...inputRecord })
            items[i] = "user" + i;
        }
    }
    return items;
  }
};

