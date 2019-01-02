import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken, setAccount, getAccount } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    account: getAccount(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setAccount (state, account) {
      state.account = account
      setAccount(account)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          if (data.code === 0 && "accessToken" in data.data) {
            commit('setToken', data.data.accessToken)
            commit('setAccount', userName)
            resolve()
          } else {
            alert(data.message)
            // _this.$Message.error(data.message)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccount', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            if (res.data.code == 1002 || res.data.message == 'Unauthenticated') {
              this.turnToPage(this.$config.homeName)
              resolve()
            } else {
              const data = res.data.data
              commit('setAvator', data.avator)
              commit('setUserName', data.mobile)
              commit('setUserId', data.id)
              commit('setAccess', data.access)
              commit('setHasGetInfo', true)
              resolve(data)
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
