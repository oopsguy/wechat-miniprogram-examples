Component({
  properties: {
    ballOpacity: {
      type: Number,
      value: .8
    },
    ballBottom: {
      type: Number,
      value: 20
    },
    ballRight: {
      type: Number,
      value: 20
    }
  },

  data: {
  },

  methods: {
    click() {
      this.triggerEvent('click')
    }
  }
})
