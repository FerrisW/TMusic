var app = getApp();
Page({

  data: {
    favoriteMusicID: '',
    songList: {},
    songTotal: '',
    name: '',
    picUrl: '',
    listenSongs: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '../login/login',
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      var userID = wx.getStorageSync("userID");
      //console.log(userID);
      if (userID) {
        var songListsUrl = app.globalData.sourceDataUrl + '/user/playlist?uid=' + userID;
        var userInfoUrl = app.globalData.sourceDataUrl + "/user/detail?uid=" + userID;
        this.getCustomerInfo(userInfoUrl);
        this.getFavoriteMusicID(songListsUrl);
      } else {
        console.log("请先登录");
      }
    }
  },

  getCustomerInfo: function(url) {
    wx.request({
      url: url,
      success: res => {
        this.setData({
          name: res.data.profile.nickname,
          picUrl: res.data.profile.avatarUrl,
          listenSongs: res.data.listenSongs
        })
      },
      fali: res => {
        console.log("用户信息获取失败");
      }
    })
  },

  getFavoriteMusicID: function(url) {
    wx.request({
      url: url,
      success: res => {
        this.setData({
          favoriteMusicID: res.data.playlist[0].id
        });
        var favoriteMusicUrl = app.globalData.sourceDataUrl1 + "?key=523077333&cache=1&type=songlist&id=" + this.data.favoriteMusicID;
        this.getFavoriteMusic(favoriteMusicUrl);
      },
      fail: res => {
        console.log("最喜欢的音乐歌单ID获取失败！");
      }
    })
  },

  getFavoriteMusic: function(url) {
    wx.request({
      url: url,
      success: res => {
        //console.log(res);
        this.setData({
          songTotal: res.data.Body.length
        });
        this.songListManage(res.data.Body);
      },
      fail: res => {
        console.log("最喜欢的音乐歌单列表获取失败！");
      }
    })
  },

  songListManage: function(songlist) {
    var list = [];
    for (var index in songlist) {
      var subject = songlist[index];
      var songNum = parseInt(index) + 1;
      var temp = {
        songName: subject.title,
        songAuthor: subject.author,
        songImg: subject.pic,
        songId: subject.id,
        songNum: songNum
      }
      list.push(temp);
    }
    this.setData({
      songList: list
    })
    wx.hideLoading();
  },

  //跳转至歌曲播放页
  onSongTap: function(event) {
    var songName = event.currentTarget.dataset.sname;
    wx.navigateTo({
      url: '../song/song?songName=' + songName,
    })
  }

})