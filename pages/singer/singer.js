var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImgUrl: [
      '/images/banner/Banner01.jpg',
      '/images/banner/Banner02.jpg',
      '/images/banner/Banner03.jpg'
    ],
    dotColor: "#e5aeac",
    dotColorSelected: "#ff0900",
    normal: true,
    singerInfo: {},
    song1: [],
    song2: [],
    song3: []
  },


  onLoad: function(options) {

    //获取热门歌手
    var singerUrl = app.globalData.sourceDataUrl + '/top/artists?limit=3';
    this.getSingerData(singerUrl);

  },

  //获取热门歌手
  getSingerData: function(url) {
    var that = this;
    wx.request({
      url: url,
      success: res => {
        //console.log(res);
        that.processSingerData(res.data.artists);
      },
      fail: res => {
        console.log("fail");
      }
    })
  },

  //处理歌手信息数据
  processSingerData: function(singerData) {
    var singleInfo = [];
    for (var index in singerData) {
      var subject = singerData[index];
      var temp = {
        singerId: subject.id,
        singerImg: subject.img1v1Url
      };
      singleInfo.push(temp);
    }
    this.setData({
      singerInfo: singleInfo
    })
    this.getSingerSong();
  },

  //获取歌手Id
  getSingerSong: function() {
    var infos = this.data.singerInfo;
    for (var index in infos) {
      var singerId = infos[index].singerId;
      var ssongUrl = app.globalData.sourceDataUrl + '/artists?id=' + singerId;
      this.getSongs(ssongUrl, index);
    }
  },

  //获取每位歌手的四首歌
  getSongs: function(ssongUrl, num) {
    wx.request({
      url: ssongUrl,
      success: res => {
        this.songInfoDealWith(res.data.hotSongs, num);
      },
      fail: res => {
        console.log("歌曲获取失败");
      }
    })
  },

  //歌曲信息处理
  songInfoDealWith: function(hotSongs, num) {
    //ar.name 作者 al.id 歌曲ID  al.name 歌曲名  al.picUrl 歌曲封面  
    //console.log(hotSongs);
    var songs = [];
    for (var index in hotSongs) {
      if (index < 4) {
        var subject = hotSongs[index];
        var temp = {
          name: subject.ar[0].name,
          songId: subject.al.id,
          songName: subject.name,
          songImg: subject.al.picUrl
        }
        songs.push(temp);
      }
    }
    //console.log(songs);
    if (num == 0) {
      this.setData({
        song1: songs
      })
    } else if (num == 1) {
      this.setData({
        song2: songs
      })
    } else if (num == 2) {
      this.setData({
        song3: songs
      })
    }
  },

  //跳转至歌曲播放页
  onSongTap: function(event) {
    var songName = event.currentTarget.dataset.sname;
    wx.navigateTo({
      url: '../song/song?songName=' + songName,
    })
  }

})