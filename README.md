微信小程序 -- 云名片(2017.10.26)

<!-- 帐号信息 -->
账号：liuxin@51simuhui.com
密码：liuxin167452
AppID：wxf5717f6e99bd96ca
AppSecret：9d00f182766070376cb924dfc6ce85ac

<!-- 开发文档 -->
1.https://mp.weixin.qq.com/debug/wxadoc/dev
2.https://segmentfault.com/a/1190000007580866

<!-- 备注 -->
1.使用微信开发者工具新建项目，本地开发选择dist目录。
2.微信开发者工具-->项目-->关闭ES6转ES5。重要：漏掉此项会运行报错。
3.微信开发者工具-->项目-->关闭上传代码时样式自动补全 重要：某些情况下漏掉此项会也会运行报错。
4.微信开发者工具-->项目-->关闭代码压缩上传 重要：开启后，会导致真机computed, props.sync 等等属性失效。#270
5.项目根目录运行wepy build --watch，开启实时编译。
6.本地host添加配置 192.168.1.43 api-doc.yd.com
7.正式环境 https://card.e-yunduan.com
8.测试环境 https://card-test.51simuhui.com