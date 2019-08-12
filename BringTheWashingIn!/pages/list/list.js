// pages/list/list.js
const dayMap = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日", ]

Page({
  data: {
    city: "北京市",
    time: new Date().getTime(),
    weeklyWeatherForcast: []
  },
  onLoad: function (option) {
    console.log('onLoad')
    console.log(option)
    this.getNow()
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  getNow(callback) {
    // let that = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: this.data.time,
        city: this.data.city
      },
      success: (res) => {
        let results = res.data.result
        this.setListData(results)
        },
      complete: () => {
        callback && callback()
      }
    })
  },
  setListData (results){
    let weeklyWeatherForcast = [];
    for (let item of results) {
      let newDate = new Date(this.data.time + 86400000 * item.id);
      // console.log(this.data.time + 86400000 * item.id)
      // console.log(item);
      weeklyWeatherForcast.push({
        day: dayMap[item.id],
        date: `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`,
        temp: `${item.minTemp}°C~${item.maxTemp}°C`,
        weatherIconPath: `/images/${item.weather}-icon.png`
      })
    };
    this.setData(
      { weeklyWeatherForcast: weeklyWeatherForcast }
    )
  }
})