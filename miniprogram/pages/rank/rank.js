// miniprogram/pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user0:0,
    numbean0:0,
    user1: 0,
    numbean1: 0,
    user2: 0,
    numbean2: 0,
    user3: 0,
    numbean3: 0,
    user4: 0,
    numbean4: 0,
    user5: 0,
    numbean5: 0,
    user6: 0,
    numbean6: 0,
    user7: 0,
    numbean7: 0,
    user8: 0,
    numbean8: 0,
    user9: 0,
    numbean9: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    const db = wx.cloud.database()
    var rank_list=db.collection('user')
      //.orderBy('numbean', 'desc').limit(10)
      .get({
        success:function(res){
          console.log(res.data)
          that.setData({
            user0: res.data[0].username,
            numbean0:res.data[0].numbean,
            user1: res.data[1].username,
            numbean1: res.data[1].numbean,
            user2: res.data[2].username,
            numbean2: res.data[2].numbean,
            user3: res.data[3].username,
            numbean3: res.data[3].numbean,
            user4: res.data[4].username,
            numbean4: res.data[4].numbean,
            user5: res.data[5].username,
            numbean5: res.data[5].numbean,
            user6: res.data[6].username,
            numbean6: res.data[6].numbean,
            user7: res.data[7].username,
            numbean7: res.data[7].numbean,
            user8: res.data[8].username,
            numbean8: res.data[8].numbean,
            user9: res.data[9].username,
            numbean9: res.data[9].numbean,
          });
        }
      });
  

  },

  //按钮返回界面
  backmap:function(){
    wx.navigateTo({
      url: '../map/map',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})