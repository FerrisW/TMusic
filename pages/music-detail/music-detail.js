var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    imgUrl: '',
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title,
    })
    if (options.special == 1) {
      this.setData({
        imgUrl: app.globalData.imgURLs[options.num]
      })
    } else {
      this.setData({
        imgUrl: app.globalData.imgURL[options.num]
      })
    }

    var listID = options.listID;
    var musicListUrl = app.globalData.sourceDataUrl1 + "?key=523077333&cache=1&type=songlist&id=" + listID;
    wx.request({
      url: musicListUrl,
      success: res => {
        console.log(res.data.Body);
        this.musicListManage(res.data.Body);
      },
      fail: res => {
        console.log("歌单获取失败");
      }
    })

  },

  musicListManage: function(musiclist) {
    var music = [];
    for (var index in musiclist) {
      if (index<30) {
        var subject = musiclist[index];
        var songNum = parseInt(index) + 1;
        var temp = {
          songName: subject.title,
          songAuthor: subject.author,
          songImg: subject.pic,
          songId: subject.id,
          songNum: songNum
        }
        music.push(temp);
      }
    }
    this.setData({
      list: music
    })

  },

  //跳转至歌曲播放页
  onSongTap: function (event) {
    var songName = event.currentTarget.dataset.sname;
    wx.navigateTo({
      url: '../song/song?songName=' + songName,
    })
  }
})