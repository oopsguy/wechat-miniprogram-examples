import Curd from './curd.js';

const KEY_COLLECTION = "key_collection";
const curd = new Curd(KEY_COLLECTION);

class Data {

  static save(data) {
    return Data.removeOneById(data.id).then(() => {
      curd.insert(data);
    });
  }

  static findAll() {
    return curd.findAll().then(data => {
      if (data) {
        return data.sort((a, b) => a.createTime < b.createTime);
      }
      return [];
    });
  }

  static findOneById(id) {
    return curd.find(i => i.id === id);
  }

  static removeOneById(id) {
    return curd.remove(i => i.id === id);
  }

}

module.exports = Data;