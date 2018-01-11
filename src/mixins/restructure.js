import wepy from 'wepy'
export default class RestructureMixin extends wepy.mixin {
  onLoad() {
    console.log('restructure mixin onLoad')
  }
  /**
   * 将获取到的个人信息中的卡片样式独立出来
   * @param [] data
   * @returns { list }
   */
  restructure(element) {
    let info = {
      checked: false
    }
    let template = {}
    for (let k in element) {
      if (k === 'template') {
        if (element[k] === null) {
          template = null
        } else {
          Object.assign(template, {
            id: element[k].id
          }, element[k].code)
        }
      } else {
        info[k] = element[k]
      }
    }
    return {
      info,
      template
    }
  }
  /**
   * 重构名片返回的列表信息
   * @param [] data
   * @returns { list }
   */
  restructureList(data) {
    let list = []
    data.forEach(element => {
      list.push(this.restructure(element))
    })
    return list
  }
  /**
   * 重构名片返回的列表信息,并已首字母排序
   * @param [] data
   * @returns { list, tags }
   */
  getAlphaList(data = []) {
    if (data.length === 0) return []
    const alphaArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let list = {}
    let lastList = []
    data.forEach(element => {
      // 重构数组结构
      const {
        template,
        info
      } = this.restructure(element)
      // 获取姓名首字母
      let alpha = info['name_pinyin'].substring(0, 1).toUpperCase()
      if (alphaArr.indexOf(alpha) !== -1) {
        // 当数组为空创建一个空数组
        if (typeof list[alpha] === 'undefined') {
          list[alpha] = []
        }
        // 以首字母归类列表
        list[alpha].push({
          template,
          info
        })
      } else {
        lastList.push({
          template,
          info
        })
      }
    })
    if (lastList.length > 0) {
      Object.assign(list, {
        '#': lastList
      })
    }
    return {
      list,
      tags: Object.keys(list)
    }
  }
}
