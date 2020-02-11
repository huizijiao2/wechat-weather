// pages/list/list.js
const dayMap = ['星期日', '星期一', '星期二','星期三','星期四','星期五','星期六']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekWeather: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeekWeather()
  },
  getWeekWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: '上海市'
      },
      success: res => {
        let result = res.data.result;
        console.log(result)
        this.setWeekWeather(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setWeekWeather(res) {
    let weekWeather = []
    
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      console.log(date.getDay())
      weekWeather.push({
        day:  dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${res[i].minTemp}-${res[i].maxTemp}`,
        iconPath: `../../images/${res[i].weather}-icon.png`
      });
      this.setData({
        weekWeather
      })
    }
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
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh()
    })
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