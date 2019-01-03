export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // 线下环境依赖 devserver 来解决跨域
    dev: '',
    // 线上环境依赖于 Nginx 反向代理来解决跨域，因此相对本地域名
    pro: '/member/v1'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  /**
   * 基础网站域名，主要用于图片访问使用
   * 如果不希望暴露API相关服务器，可在服务器上做软链接，并在此处填写可访问的路径
   */
  uploadBase: 'http://api.daisy.hangyutech.com/storage/'
}
