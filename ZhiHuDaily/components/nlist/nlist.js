Component({
  properties: {
    dataSource: {
      type: Array,
      value: []
    }
  },

  data: {
  },

  methods: {
    onTap(e) {
      this.triggerEvent('click', {
        data: e.currentTarget.dataset.item
      });
    },
    onLongTap(e) {
      this.triggerEvent('longclick', {
        data: e.currentTarget.dataset.item
      });
    }
  }
})
