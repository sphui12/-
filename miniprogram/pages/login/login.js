// miniprogram/pages/login/login.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "a",
    password:"a",
  },

  usernameInput: function (event) {
    this.setData({ username: event.detail.value });
    app.globalData.username = event.detail.value;
  },

  passwordInput: function (event) {
    this.setData({ password: event.detail.value });
    app.globalData.password = event.detail.value;
  },

  loginBtnClick: function (event) {
      const db = wx.cloud.database()
      db.collection('user').add({
        data: {
          username: app.globalData.username,
          password:this.data.password,
          numbean:0,
        },
        success: loginBtnClic => {
          // 在返回结果中会包含新创建的记录的 _id

          wx.showToast({
            title: '新增记录成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', loginBtnClic._id)

          app.globalData._id=loginBtnClic._id
          wx.navigateTo({
            url: '../list/list',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }

      
      })
  
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