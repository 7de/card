import wepy from 'wepy'
export default class ConfigMixin extends wepy.mixin {
  data = {
    host: null,
    windowHeight: null
  }
  onLoad() {
    // global data
    const {
      host
    } = this.$parent.globalData || this.$parent.$parent.globalData
    this.host = host
    // this.host = 'https://card-test.51simuhui.com'
    // system data
    const {
      windowHeight,
      windowWidth
    } = wepy.getSystemInfoSync()
    this.windowHeight = windowHeight
    this.windowWidth = windowWidth
    this.$apply()
    console.log('Config mixin onLoad')
  }

  methods = {
    bindFormSubmit(e) {
      const {
        formId,
        target
      } = e.detail
      console.log('Post formId')
      if (formId && formId !== 'the formId is a mock one') { // 发送form_id
        this._saveFormId(formId)
      }
      if (target.dataset && target.dataset.value) { // 基础事件
        this._defaultEvent(target.dataset)
      }
      if (target.dataset && target.dataset.url) { // 页面链接
        this._navigator(target.dataset)
      }
    }
  }

  _saveFormId(formId) {
    this.$parent.post(`/card/save-form-id`, {
      'form_id': formId
    })
  }

  _defaultEvent(dataset) {
    const {
      type,
      value,
      urls
    } = dataset
    switch (type) {
      case 'previewImage':
        wepy.previewImage({
          current: value,
          urls
        })
        break
      case 'mobile': // 拨打电话
        wepy.makePhoneCall({
          phoneNumber: value
        })
        break
      case 'wxpay': // 微信支付
        this._toWxPay(value)
        break
      case 'ybpay': // 云币支付
        this._toYbPay(value)
        break
      case 'postCard': // 回传名片
        this._postCard(value)
        break
      default:
        console.log('没有设置类型，默认事件')
    }
  }

  _navigator(dataset) {
    const {
      url,
      type
    } = dataset
    switch (type) {
      case 'redirect': // 关闭当前页面，跳转到应用内的某个页面
        wepy.redirectTo({
          url
        })
        break
      case 'reLaunch': // 关闭所有页面，打开到应用内的某个页面
        wepy.reLaunch({
          url
        })
        break
      case 'switchTab': // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
        wepy.switchTab({
          url
        })
        break
      case 'navigateBack': // 关闭当前页面，返回上一页面或多级页面
        wepy.navigateBack({
          delta: parseInt(url)
        })
        break
      default: // 保留当前页面，跳转到应用内的某个页面
        wepy.navigateTo({
          url
        })
    }
  }

  _toWxPay(orderId) {
    wepy.showLoading({
      mask: true
    })
    this.$parent.post(`/order/wechat-pay/${orderId}`).then(res => {
      const {
        code,
        data,
        message
      } = res
      if (code === 0) {
        const options = {
          success: (res) => {
            wepy.redirectTo({
              url: encodeURI(`message?type=success&title=支付成功&desc=`)
            })
          },
          fail: (res) => console.log(res)
        }
        wepy.requestPayment(Object.assign(options, data))
      } else {
        wepy.showModal({
          title: '系统提示',
          content: message,
          showCancel: false,
          confirmColor: '#1875f0'
        })
      }
      wepy.hideLoading()
    })
  }

  _toYbPay(orderId) {
    wepy.showLoading({
      mask: true
    })
    this.$parent.post(`/order/balance-pay/${orderId}`).then(res => {
      const {
        code,
        data,
        message
      } = res
      if (code === 0 && data === 'ok') {
        wepy.redirectTo({
          url: encodeURI(`message?type=success&title=支付成功&desc=`)
        })
      } else {
        wepy.redirectTo({
          url: encodeURI(`message?type=warn&title=支付失败&desc=${message}`)
        })
      }
      wepy.hideLoading()
    })
  }

  _postCard(id) {
    const URL = `/order/post-card/${id}`
    this.$parent.post(URL).then(res => {
      const {
        code,
        data,
        message
      } = res
      if (code === 0) {
        wepy.navigateTo({
          url: `library-payment?orderID=${data.id}`
        })
      } else {
        wepy.showModal({
          title: '温馨提示',
          content: message,
          showCancel: false,
          confirmColor: '#1875f0'
        })
      }
    })
  }

  onFetchError(message) {
    wepy.showModal({
      title: '温馨提示',
      content: message,
      showCancel: false,
      confirmColor: '#1875f0',
      success: function (res) {
        wepy.navigateBack()
      }
    })
  }
}
