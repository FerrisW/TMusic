// pages/home/home.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommend: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
    searchValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var recommendMusicListUrl = app.globalData.sourceDataUrl + '/top/playlist' + '?limit=9';
    this.getRecommendMusicList(recommendMusicListUrl);
  },

  //搜索
  onBindConfirm: function(event) {
    var searchWord = event.detail.value;
    var searchUrl = app.globalData.sourceDataUrl + "/search?keywords=" + searchWord;
    this.getSearchAnswer(searchUrl);
  },

  getSearchAnswer: function(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log("fail");
      }
    })
  },

  //获取推荐歌单
  getRecommendMusicList: function(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": 'json'
      },
      success: res => {
        that.dealWithRecommendData(res.data.playlists);
      },
      fail: error => {
        console.log(error);
      }
    })
  },

  //推荐歌单数据处理
  dealWithRecommendData: function(recommendMusicData) {
    var playList = [];
    var bgUrl = [];
    for (var index in recommendMusicData) {
      var subject = recommendMusicData[index];
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
        num: index
      }
      playList.push(temp);
      bgUrl.push(subject.coverImgUrl);
    }
    app.globalData.imgURLs = bgUrl;
    this.setData({
      recommend: playList
    })
    console.log(recommendMusicData);
    wx.hideLoading();
  },

  //获取更多歌单数据
  onMoreTap: function() {
    wx.navigateTo({
      url: '../more-music/more-music',
    })
  },

  //查看歌单详情
  onMusicTap: function(event) {
    var musicDescription = event.currentTarget.dataset.description;
    var num = event.currentTarget.dataset.num;
    var title = event.currentTarget.dataset.title;
    var listID = event.currentTarget.dataset.listid;
    wx.navigateTo({
      url: '../music-detail/music-detail?description=' + musicDescription + '&num=' + num + '&title=' + title + '&special=1' + '&listID=' + listID,
    })
  },

  onBindFocus: function(e) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindInput: function(event) {
    this.setData({
      searchValue: event.detail.value
    })
  },

  onCancelImgTap: function(e) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      searchValue: ''
    })
  },

  onBindConfirm: function(event) {
    console.log(event.detail.value);
    wx.showNavigationBarLoading();
    var keyWord = event.detail.value;
    var searchUrl = app.globalData.sourceDataUrl + '/search?keywords=' + keyWord;
    this.getSearchResult(searchUrl);
  },

  getSearchResult: function(url) {
    wx.request({
      url: url,
      success: res => {
        console.log(res.data.result.songs);
        this.showResult(res.data.result.songs);
      },
      fail: res => {
        console.log("未成功获取搜索结果");
      }
    })
  },

  showResult: function(result) {
    var list = [];
    for (var index in result) {
      var subject = result[index];
      var songNum = parseInt(index) + 1;
      var temp = {
        songName: subject.name,
        songAuthor: subject.artists[0].name,
        songImg: subject.album.blurPicUrl,
        songId: subject.id,
        songNum: songNum
      }
      list.push(temp);
    }
    this.setData({
      searchResult: list
    })
    wx.hideNavigationBarLoading();
  },

  //跳转至歌曲播放页
  onSongTap: function (event) {
    var songName = event.currentTarget.dataset.sname;
    wx.navigateTo({
      url: '../song/song?songName=' + songName,
    })
  }

})