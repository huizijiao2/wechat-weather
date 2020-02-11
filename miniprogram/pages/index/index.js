//index.js
const app = getApp()
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
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

const AUTHED = 1;
const UNAUTHED = 2;
const UNPROMPTED = 0;

const AUTHED_TIPS = '';
const UNAUTHED_TIPS = '点击开启位置权限';
const UNPROMPTED_TIPS = '点击获取当前位置';

const wxMap = require('../../libs/qqmap-wx-jssdk.min.js')
const md5 = require('../../libs/md5.min.js')

const wxmapsdk = new wxMap({
  key: 'MFSBZ-XIU34-44KUZ-X7IW5-RYLU7-QKBF6'
})

Page({
  data: {
    nowTemp: 14,
    nowWeather: '多云',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayTemp: '',
    todayDate: '',
    city: '北京市',
    locationTipsText: UNPROMPTED_TIPS,
    locationTipstype: UNPROMPTED
  },
  onLoad() {
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        this.setData({
          locationTipsText: auth ? AUTHED_TIPS : (auth === false ? UNAUTHED_TIPS : UNPROMPTED_TIPS),
          locationTipstype: auth ? AUTHED : (auth === false ? UNAUTHED : UNPROMPTED)
        })
        if(auth) {
          this.getLocation()
        } else {
          this.getNow()
        }
      }
    })
  },
  onTapLocation() {
    if (this.data.locationTipstype === UNAUTHED)
      wx.openSetting({
        success: res => {
          let auth = res.authSetting['scope.userLocation']
          if (auth) {
            this.getLocation()
          }
        }
      })
    else
      this.getLocation()
  },
  getLocation() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationTipsText: AUTHED_TIPS,
          locationTipstype: AUTHED
        });
        wxmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: (res) => {
            this.setData({
              city: res.result.address_component.city,
            })
            this.getNow()
          }
        })
      },
      fail: res => {
        this.setData({
          locationTipsText: UNAUTHED_TIPS,
          locationTipstype: UNAUTHED
        })
      }
    })
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  getNow(callback) {

    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city,
      },
      success: res => {
        let result = res.data.result;
        let temp = result.now.temp;
        let weather = result.now.weather;
        let nowHour = new Date().getHours();
        let forecast = result.forecast;
        let weatherArr = [];
        for (let i = 0; i < 24; i += 3) {
          weatherArr.push({
            time: (i + nowHour) % 24 + '时',
            iconPath: '/images/' + forecast[i / 3].weather + '-icon.png',
            temp: forecast[i / 3].temp + '°'
          })
        }
        this.setData({
          nowTemp: temp + '°',
          nowWeather: weatherMap[weather],
          nowWeatherBackground: `../../images/${weather}-bg.png`,
          hourlyWeather: weatherArr

        })
        this.setToday(result.today)
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setToday(today) {
    let date = new Date();
    this.setData({
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`,
      todayTemp: `${today.minTemp} - ${today.maxTemp}`
    })
  },
  onTapDayWeather() {
    wx.showToast({});
    wx.navigateTo({
      url: `/pages/list/list?city=${this.data.city}`,
    })
  }
})