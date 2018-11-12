import axios from '@/libs/api.request'

export const getCustomList = (page, pageSize) => {
  const data = {
    page:page,
    pagesize:pageSize
  }
  return axios.request({
    url: '/customer/list',
    data,
    method: 'get'
  })
}



export const upgradeCustom = ({ uid, upCode }) => {
  const data = {
    uid,
    upCode
  }
  return axios.request({
    url: '/customer/upgrade',
    data,
    method: 'post'
  })
}


export const addCustomerToAgent = (mobile) => {
  const data = {
    mobile:mobile
  }
  return axios.request({
    url: '/customer/add',
    data,
    method: 'post'
  })
}

export const switchUserFront = (uid) => {
  let data = {uid: uid};
  return axios.request({
    url: '/customer/switch',
    data,
    method: 'post'
  })

}

