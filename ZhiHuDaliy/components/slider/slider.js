Component({
  properties: {
    dataSource: {
      type: Array
    }
  },

  data: {
  },

  methods: {
    itemClick(e) {
      this.triggerEvent('click', {
        data: e.currentTarget.dataset.item
      });
    }
  }
})

