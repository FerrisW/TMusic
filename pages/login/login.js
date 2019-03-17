var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    password: null
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '登录',
    })
  },

  login: function(event) {
    wx.showNavigationBarLoading();
    if (this.data.username != null && this.data.password != null) {
      var loginUrl = app.globalData.sourceDataUrl + '/login/cellphone?phone=' + this.data.username + '&password=' + this.data.password;
      wx.request({
        url: loginUrl,
        success: res => {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '登录成功',
              image: '/images/success.png',
            })
            wx.setStorageSync("username", this.data.username);
            wx.setStorageSync("password", this.data.password);
            wx.setStorageSync("userID", res.data.account.id);
            app.globalData.isLogin = true;
            setTimeout(function(){
              wx.switchTab({
                url: '../personal/personal',
              });
            },2000);
          } else {
            wx.showToast({
              title: res.data.msg,
              image: '/images/fail.png',
              duration: 3000
            })
          }
        },
        fail: res => {
          console.log("登陆失败");
        },
        complete: res => {
          wx.hideNavigationBarLoading();
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '账号或密码不能为空！',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      wx.hideNavigationBarLoading();
    }
  },

  usernameInput: function(event) {
    //console.log(event);
    this.setData({
      username: event.detail.value
    })
  },

  passwordInput: function(event) {
    this.setData({
      password: event.detail.value
    })
  },

  toHome:function(event){
    wx.switchTab({
      url: '../home/home',
    })
  }




})