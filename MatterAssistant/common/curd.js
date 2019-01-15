class Curd {

  constructor(key) {
    if (!key) {
      throw new Error('Invalid key!');
    }
    this.key = key;
  }

  insert(data) {
    return this.findAll().then(d => {
      d = d || [];
      d.push(data);
      return setStorage(this.key, d);
    })
  }

  update(data, filter) {
    return this.remove(filter).then(() => this.insert(data));
  }

  findAll(filter) {
    return getStorage(this.key).then(data => {
      if (!data) {
        return [];
      }
      if (!filter) {
        return data;
      }
      return data.filter(filter);
    });
  }

  find(filter) {
    return getStorage(this.key).then(data => {
      if (!data || !filter) {
        return data;
      }
      return data.find(filter);
    });
  }

  remove(filter) {
    if (!filter) {
      return Promise.reject(new Error('Invalid filter!'));
    }
    return getStorage(this.key).then(data => {
      let index = data.findIndex(filter);
      // 没找到记录则直接忽略走正常流程
      if (index === -1) {
        return Promise.resolve();
      }
      data.splice(index, 1);
      return setStorage(this.key, data);
    });
  }

  removeRange(filter) {
    return getStorage(this.key).then(data => {
      if (!data) {
        return;
      }
      let newArr = [];
      for (let i = 0; i < data.length; i++) {
        if (filter && !filter(data[i])) {
          newArr.push(data[i]);
        }
      }
      return setStorage(this.key, data);
    });
  }

}

function setStorage(key, data) {
  return new Promise(function(resolve, reject) {
    wx.setStorage({
      key: key,
      data: data,
      success: function() {
        resolve();
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function getStorage(key) {
  return new Promise(function(resolve, reject) {
    wx.getStorage({
      key: key,
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        // 为了方便后期处理，找不到数据也走正常流程，返回 null 数据
        resolve(null);
      }
    });
  });
}

module.exports = Curd;