import SteinStore  from 'stein-js-client';

const store = new SteinStore(
  "https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4"
);

class Fish {
  static getList({
    limit = 20,
    offset = 1,
    search = null
  }) {
    return store.read('list', { limit, offset, search });
  }
}

export default Fish;