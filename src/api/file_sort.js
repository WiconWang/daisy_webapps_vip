import axios from '@/libs/api.request'


export const getFileSortList = (page, pageSize) => {
  const data = {
    page:page,
    pagesize:pageSize
  }
  return axios.request({
    url: '/archive',
    params: data,
    method: 'get'
  })
}
export const getFileSortInfo = (id) => {
  return axios.request({
    url: '/article/' + id,
    method: 'get'
  })
}

export const saveFileSortStatus = (id,archived) => {
  const data = {
    archived: archived
  }
  return axios.request({
    url: '/archive/'+id,
    data,
    method: 'patch'
  })
}
