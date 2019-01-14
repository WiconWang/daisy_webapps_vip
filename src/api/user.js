import axios from '@/libs/api.request'

export const login = ({userName, password}) => {
  const data = {
    username: userName,
    password: password
  }
  return axios.request({
    url: '/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/info/',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/logout',
    method: 'get'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: '/message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: '/message/index',
    method: 'get'
  })
}

export const getContentByMsgId = id => {
  console.log(id)
  return axios.request({
    url: '/message/content',
    method: 'get',
    params: {
      id
    }
  })
}

export const hasRead = id => {
  return axios.request({
    url: '/message/reading',
    method: 'patch',
    data: {
      id
    }
  })
}

export const removeReaded = id => {
  return axios.request({
    url: '/message/remove',
    method: 'patch',
    data: {
      id
    }
  })
}

export const restoreTrash = id => {
  return axios.request({
    url: '/message/restore',
    method: 'patch',
    data: {
      id
    }
  })
}
