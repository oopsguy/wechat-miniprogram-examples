import Curd from 'curd';
import util from 'util';
import config from 'constant';

const curdOpt = new Curd(config.ITEMS_SAVE_KEY);

class Data {

  static save(data) {
    if (!data['_id']) {
      data['_id'] = util.guid();
    }
    return curdOpt.insert(Object.assign(data, {
      addDate: new Date().getTime()
    }));
  }

  static findAll() {
    return curdOpt.findAll();
  }

  /**
   * 通过id获取事项
   */
  static findOneById(id) {
    return curdOpt.find(i => i['_id'] === id);
  }

  /**
   * 根据id删除事项数据
   */
  static removeOneById(id) {
    return curdOpt.remove(i => i['_id'] === id);
  }

  /**
   * 批量删除数据
   * @param {Array} ids 事项Id集合
   */
  static removeByIds(ids) {
    if (!ids || !ids instanceof Array) {
      return Promise.reject(new Error('ids parameter must be an non-empty array'));
    }
    return curdOpt.remove(i => ids.indexOf(i['_id']) > -1);
  }

  /**
   * 根据日期查找所有符合条件的事项记录
   * @param {Date} date 日期对象
   * @returns {Array} 事项集合
   */
  static findByDate(date) {
    if (!date) return [];
    return curdOpt.findAll(item => {
      return item && item['date'] == date.getDate() &&
        item['month'] == date.getMonth() &&
        item['year'] == date.getFullYear();
    });
  }

}

module.exports = Data;
