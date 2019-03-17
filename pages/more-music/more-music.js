var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommend:{},
    count:14,
    firstRequest:true,
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '推荐歌单'
    })
    wx.showLoading({
      title: '加载中',
    })
    var recommendMusicListUrl = app.globalData.sourceDataUrl + '/top/playlist' + '?limit=14';
    this.getRecommendMusicList(recommendMusicListUrl);
  },

  onShow: function () {

  },

  onReachBottom:function(e){
    var sumNum = this.data.count+9;
    var nextUrl = app.globalData.sourceDataUrl + '/top/playlist' + '?limit=' + sumNum;
    this.setData({
      count: sumNum,
    })
    this.getRecommendMusicList(nextUrl);
    wx.showNavigationBarLoading();
  },

  //获取推荐歌单
  getRecommendMusicList: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": 'json'
      },
      success: res => {
        //console.log(res);
        that.dealWithRecommendData(res.data.playlists);
      },
      fail: error => {
        console.log(error);
      }
    })
  },

  //推荐歌单数据处理
  dealWithRecommendData: function (recommendMusicData) {
    var music = [];
    var bgUrl=[];
    if (this.data.firstRequest){
      var index=0;
    }else{
      var index = this.data.count-9;
    }
    for (var idx in recommendMusicData){  
      if (idx >= index){
        var subject = recommendMusicData[idx];
        var title = subject.name;
        if (title.length > 8) {
          title = title.substring(0, 8) + "...";
        }
        var description = subject.description.replace(/\↵/g, "\n");
        var temp = {
          listId: subject.id,
          title: title,
          coverImgUrl: subject.coverImgUrl,
          description: description,
          num: idx
        }
        music.push(temp);
        bgUrl.push(subject.coverImgUrl);
      }
      
    }
    app.globalData.imgURL = app.globalData.imgURL.concat(bgUrl);

    var totalMusic = {};
    if (!this.data.firstRequest) {
      totalMusic = this.data.recommend.concat(music);
    }
    else {
      totalMusic = music;
      this.data.firstRequest = false;
    }
    this.setData({
      recommend: totalMusic
    })
    wx.hideLoading();
    wx.hideNavigationBarLoading();
  },

  onMusicTap: function (event) {
    console.log(event);
    var musicDescription = event.currentTarget.dataset.description;
    var num = event.currentTarget.dataset.num;
    var title = event.currentTarget.dataset.title;
    var listID = event.currentTarget.dataset.listid;
    wx.navigateTo({
      url: '../music-detail/music-detail?description=' + musicDescription + '&num=' + num + '&title=' + title + '&special=2' + '&listID=' + listID,
    })
  }

})