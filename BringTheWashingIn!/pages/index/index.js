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

const amapFile = require('../../libs/amap-wx.js');


Page({
  onLoad() {
    // console.log("Hello Wold")
    this.amapsdk = new amapFile.AMapWX({ key: '9f072d6d42964ba971dccb0474336181' })
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
    city:"成都市",
    locationTipsText: "点击获取当前位置",
  },
  getNow(callback) {
    // let that = this
    // console.log(this.data.city)
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city : this.data.city,
      },
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
      data: {
        city: this.data.city,
      }
    })
  },
  onTapLocation(){
    wx.getLocation({
      success: (res) => {
        let longitude = res.longitude
        let latitude = res.latitude
        this.amapsdk.getRegeo({
          location: `${longitude},${latitude}`,
          success: (data) => {
            // console.log(data)
            let city = '';
            if (data[0].regeocodeData.addressComponent.city[0]) {
              city = data[0].regeocodeData.addressComponent.city;
            } else {
              city = data[0].regeocodeData.addressComponent.province;
            };
            this.setData({
              city: city,
              locationTipsText: ""
            })
          },
          fail: (info) => {
            console.log(info);
          }
        })
      },
    });
    this.getNow();
    // console.log(this.data)
  }

 })
