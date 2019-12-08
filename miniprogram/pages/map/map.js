// miniprogram/pages/map/map.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //游戏是否进行
    flag:false,
    //豆子数量
    numbean:0,
    gamestate:'游戏开始',
    //按钮是否可用：
    disable:false,
    //游戏时间限制：
    timelimit:3,
    minute:10,
    second:'00',
    //当前经纬度：
    latitude: 0, 
    longitude: 0,
    //标记建筑数组：
    markers: [{
      id:0,
      longitude: 120.022512,
      latitude: 30.292156,
      iconPath: 'zhen.png',
      alpha:1,
      
      callout:{
        content: '静思苑2',
        color: 'lightgray',
        fontSize: 15,
        borderRadius: 5,
        bgColor: 'white',
        display: 'BYCLICK',              //显示模式
        padding: 5,
        textAlign: 'center'
      }
    },
    {
      id: 1,
      longitude: 120.017912,
      latitude: 30.292176,
      iconPath: 'zhen.png',
      alpha: 1,
      callout: {
        content: '静思苑13',
        color: 'lightgray',
        fontSize: 15,
        borderRadius: 5,
        bgColor: 'white',
        display: 'BYCLICK',              //显示模式
        padding: 5,
        textAlign: 'center'
      }
    }],
    //标记的圆圈数组：
    circles:[{
      longitude: 120.022512,
      latitude: 30.292156,
      color: '#FF000011',
      fillColor: '#7cb5ec88',
      radius: 50,
      strokeWidth: 0.1                              
    },
    {
      longitude: 120.017912,
      latitude: 30.292176,
      color: '#FF000011',
      fillColor: '#7cb5ec88',
      radius: 50,
      strokeWidth: 0.1
    }],
    //范围多边形的圈地：
    polygons:[{
      points:[
        {
          longitude: 120.00722819423676,
          latitude: 30.285736200474823
        },
        {
          longitude: 120.02614313220978,
          latitude: 30.29129478894598
        },
        {
          longitude: 120.023299990654,
          latitude: 30.30010450635362
        },
        {
          longitude: 120.0115572795868,
          latitude: 30.297093913817026
        },
        {
          longitude: 120.01221173858643,
          latitude: 30.293008623524525,
        },
        {
          longitude: 120.00456207847596,
          latitude: 30.29009971900551
        },
        {
          longitude: 120.00722819423676,
          latitude: 30.285736200474823
        }
      ],
      strokeWidth: 5, // 设置线宽度 注：电脑模拟器无法预览测设设置，此设置需要手机测试
      fillColor: "#ff808033",
      strokeColor: "#7cb5ec",
    }],

  },


  //相关函数



  //根据两地经纬度计算距离的函数,1为当前位置，2为计算点位置，单位为米
  distance: function (la1, lo1, la2, lo2) {

    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10;
    console.log("距离", s)
    return s
  },

  //倒计时递归函数
  countdown:function(time){
    var second=time%60;
    if (second < 10) second = '0' + second;
    var minute=(time-second)/60;
    if (minute < 10) minute = '0' + minute;
    this.setData({
      second: second,
      minute: minute,
    })

    time=time-1;
    if (time >= 0) {
      setTimeout(this.countdown, 1000, time);
    }else{

      //如果倒计时结束，上传用户成绩
      const db = wx.cloud.database()
      db.collection('user').doc(app.globalData._id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          numbean:this.data.numbean
        },
        success: function (res) {
          //console.log(res.data)
        }
      })

      this.setData({
        disable: false,
        gamestate: '重玩',
        flag: false,
      });
    }    
  },
  //豆豆重新出现函数
  beanback:function(bean,temp,time){
    var that=this;
    setTimeout(function () {
      that.setData({
        [bean]: temp,
      })
    }, 10000)
    /*
    setTimeout(function () {
      console.log(that.data.markers[0]);
    },15000)
    */
  },

  //获取中心点位置
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },

  //放置标记点
  placeMarker: function () {
    var that = this
    that.mapCtx.getCenterLocation({

      success: function (res) {
        console.log(res.latitude)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: 'zhen.png',
          }],     
        })

      }
    })
  },
  //移动至标记点
  moveToLocation: function (options) {
    var that = this
    that.mapCtx.moveToLocation({
      latitude:that.data.latitude,
      longitude:that.data.longitude
    },)
  },
  //按钮启动开始倒计时
  start:function(){
    console.log(app.globalData.username);
    
    var numtemp=0;
    var that = this;
    var time=that.data.timelimit;
    let temp;
    this.setData({
      disable:'false',
      gamestate:'游戏中',
      flag:true,
      numbean: 0,
    })
     //settimeout里函数一定不能带括号，否则会立即实行，若函数有参数请放在第三个参数后
    setTimeout(this.countdown,1000,time);

    var gamein=setInterval(function(){
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          let x = res.latitude;
          let y = res.longitude;
          let i = 0;
          //循环遍历教学楼数组，计算教学楼是否在自己位置的50米范围内

          for (i = 0; i < that.data.markers.length; i++) {
            if(!that.data.flag)clearInterval(gamein);
            let marktemp = "markers[" + i + "]";
            let dis = that.distance(x, y, that.data.markers[i].latitude, that.data.markers[i].longitude);
            temp = that.data.markers[i];

            //若距离满足条件，则豆豆消失
            if (dis < 50 && that.data.markers[i] != ' ') {
              numtemp+=1;
              console.log(numtemp)
              that.setData({
                [marktemp]: ' ',
                numbean: numtemp,
              })

              console.log('删除后', that.data.markers[i], that.data.numbean);
              //一段时间后重新出现豆豆
              that.beanback(marktemp, temp, 10000);
            }
          }
        },
        fail: (res) => {
        }
      });
    },5000);

  },

  rank:function (){
    wx.navigateTo({
      url: '../rank/rank',
    })
  },

  //当页面开始加载时：
  onLoad: function (options) {
    let that = this

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        //console.log(that.data.markers[0].latitude);
        let x = res.latitude;
        let y = res.longitude;

        that.setData({
          latitude: x,
          longitude:y,
        })
       
      },
      fail: (res) => {
       
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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
    wx.showShareMenu({
      withShareTicket: true
    })

    return {
      title: '地图测试',//分享内容
      path: 'pages/map/map',//分享地址
      imageUrl: 'share.jpg',//分享图片
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {//判断分享是否成功
          if (res.shareTickets == undefined) {//判断分享结果是否有群信息
            //分享到好友操作...
          } else {
            //分享到群操作...
            var shareTicket = res.shareTickets[0];
            //获取当前群相关信息
            wx.getShareInfo({
              shareTicket: shareTicket,
              success: function (e) {     
                /*
                var encryptedData = e.encryptedData;
                var iv = e.iv;
                */
              }
            })
          }
        }
      }
    }



  },

})