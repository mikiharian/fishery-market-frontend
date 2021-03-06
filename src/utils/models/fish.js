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

  static addCommodity(data) {
    return store.append('list', [data]);
  }

  static getArea() {
    return store.read('option_area');
  }

  static getSize() {
    return store.read('option_size');
  }
}

export default Fish;