const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴天',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  onLoad() {
    // console.log("Hello Wold")
    this.getNow()
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  data: {
    temp: "",
    weather: "",
    weatherBackgroudImage: "",
    forecast: [],
    todayTemp: "",
    todayDate: "",
  },
  getNow(callback) {
    // let that = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now?city=北京市',
      success: (res) => {
        // console.log(res.data)
        let weatherResult = res.data.result
        this.setNow(weatherResult)
        this.setToday(weatherResult)
        this.setHourlyForcast(weatherResult)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setNow(weatherResult){
    let temp = weatherResult.now.temp
    let weather = weatherResult.now.weather
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      temp: temp + '°',
      weather: weatherMap[weather],
      weatherBackgroudImage: "/images/" + weather + "-bg.png",
    })
  },
  setToday(weatherResult){
   let date = new Date()
   this.setData({
     todayTemp: `${weatherResult.today.minTemp}°C~${weatherResult.today.maxTemp}°C`,
     todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`
   })
  },
  setHourlyForcast(weatherResult){
    let forecastResults = weatherResult.forecast;
    let nowHour = new Date().getHours();
    let forecast = [];
    for (let i = 0; i < 8; i++) {
      forecast.push({
        time: (nowHour + i * 3) % 24,
        iconPath: "/images/" + forecastResults[i].weather + "-icon.png",
        temp: forecastResults[i].temp + "°C"
      });
    };
    forecast[0].time = "Now"
    this.setData({
      forecast: forecast,
    })
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: "/pages/list/list",
    })
  }
 })
