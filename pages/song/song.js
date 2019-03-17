var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playType: 1,
    showPlayList: true,
    playState: false,
    xz: "cd-img cd-animation",
    songname: '',
    songImg: '',
    songAuthor: '',
    songID: '',
    duration: 0,
    currentTime: 0,
    isDown: false,
    lrc: {
      "0": "正在获取...",
      "1": ""
    },
    currentLrc: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var songName = options.songName;
    var url = app.globalData.sourceDataUrl + '/search?keywords=' + songName;
    this.getSongInfo(url);
  },

  getSongInfo: function(url) {
    wx.request({
      url: url,
      success: res => {
        console.log(res.data.result.songs[0]);
        var head = res.data.result.songs[0];
        this.setData({
          songname: head.name,
          songImg: head.album.blurPicUrl,
          songAuthor: head.artists[0].name,
          songID: head.id
        })
        this.play();
        this.getLyric();
      },
      fail: res => {
        console.log('歌曲信息获取失败！');
      }
    })
  },

  changePlayType: function(e) {
    var dataSet = e.currentTarget.dataset;
    if (dataSet.type == 1) {
      this.setData({
        playType: 2
      });
    }
    if (dataSet.type == 2) {
      this.setData({
        playType: 0
      });
    }
    if (dataSet.type == 0) {
      this.setData({
        playType: 1
      });
    }
  },

  changing: function() {
    this.setData({
      isDown: true
    })
  },

  change: function(event) {
    this.setData({
      isDown: false,
      currentTime: event.detail.value
    })
    app.globalData.songDetail.seek(event.detail.value)
  },

  play: function() {
    var songDetail = app.globalData.songDetail;
    if (!songDetail) {
      songDetail = app.globalData.songDetail = wx.createInnerAudioContext();
    }
    songDetail.src = app.globalData.playUrl + "?id=" + this.data.songID + '.mp3';
    songDetail.play();
    songDetail.onTimeUpdate(res => {
      if (this.data.duration !== songDetail.duration) {
        this.setData({
          duration: songDetail.duration
        })
      }
      if (!this.data.isDown) {
        this.setData({
          currentTime: songDetail.currentTime
        })
      }
      let {
        currentTime: c
      } = songDetail;
      let min = Math.floor(c / 60);
      let sec = Math.floor(c % 60);
      var attr = (min < 10 ? "0" + min : "" + min) + ":" + (sec < 10 ? "0" + sec : "" + sec)
      //console.log(attr);
      if (attr in this.data.lrc && "el-"+attr !== this.data.currentLrc) {
        this.setData({
          currentLrc:"el-"+attr
        })
      }
    })
  },

  pauseMusic: function() {
    //app.globalData.songDetail.paused 可用于判断歌曲当前状态为播放或停止
    let {
      songDetail
    } = app.globalData;
    if (this.data.playState) {
      this.setData({
        playState: false,
        xz: "cd-img cd-animation"
      })
      songDetail.play();
    } else {
      this.setData({
        playState: true,
        xz: "cd-img"
      })
      songDetail.pause();
    }
  },

  getLyric: function() {
    wx.request({
      url: app.globalData.sourceDataUrl + "/lyric?id=" + this.data.songID,
      success: res => {
        console.log(res);
        let {
          lyric
        } = res.data.lrc;
        //console.log(lyric);
        let r = /\[(.*?)](.*)/g;
        var obj = {};
        lyric.replace(r, ($0, $1, $2) => {
          obj[$1.substring(0, 5)] = $2;
        })
        this.setData({
          lrc: obj
        })
      },
      fail: res => {
        console.log("歌词获取失败");
      }
    })
  }
})