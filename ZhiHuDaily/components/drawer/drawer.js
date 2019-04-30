Component({
  properties: {
    right: {
      type: Number,
      value: 0
    },
    width: {
      type: Number,
      value: 0
    }
  },

  data: {
    maskDisplay: 'none',
    drawerHeight: 0,
    drawerWidth: 0,
    drawerRight: 0,
    animation: {}
  },

  attached() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          drawerHeight: res.windowHeight,
          drawerRight: (this.data.right && this.data.right > 0) ? this.data.right : res.windowWidth,
          drawerWidth: (this.data.width && this.data.width > 0) ? this.data.width : res.windowWidth * 0.7
        });
      }
    });
  },

  methods: {
    onMaskTap() {
      this.hide();
    },
    show() {
      this.drawerSwitch(true);
    },
    hide() {
      this.drawerSwitch(false);
    },
    toggle() {
      let show = this.data.maskDisplay == 'block' ? true : false;
      this.drawerSwitch(!show);
    },
    drawerSwitch(isShow) {
      let animation = wx.createAnimation({
        duration: 200
      });
      animation.translateX(isShow ? '100%' : '-100%').step();
      this.setData({
        maskDisplay: isShow ? 'block' : 'none',
        animation: animation.export()
      });
      this.triggerEvent('toggle', { show: isShow });
    }
  }
})
