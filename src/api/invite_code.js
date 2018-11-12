import axios from '@/libs/api.request'

export const getCodeList = (page, pageSize) => {
  const data = {
    page:page,
    pagesize:pageSize
  }
  return axios.request({
    url: '/code/list',
    params: data,
    method: 'get'
  })
}

export const createCode = (params) => {
  const data = {
    level:params.level,
    number:params.codeNumber,
    expire:params.codeExpire
  }
  console.log(data)
  return axios.request({
    url: '/code/add',
    data,
    method: 'post'
  })
}

