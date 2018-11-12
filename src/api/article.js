import axios from '@/libs/api.request'


export const addArticle = (data) => {
  return axios.request({
    url: '/article',
    data,
    method: 'post'
  })
}

export const getArticleList = (page, pageSize) => {
  const data = {
    page:page,
    pagesize:pageSize
  }
  return axios.request({
    url: '/article',
    params: data,
    method: 'get'
  })
}

export const getArticle = (id) => {
  return axios.request({
    url: '/article/'+id,
    method: 'get'
  })
}

export const editArticle = (data , aid) => {
  return axios.request({
    url: '/article/'+ aid,
    data,
    method: 'put'
  })
}

export const delArticle = (id) => {
  return axios.request({
    url: '/article/'+id,
    method: 'delete'
  })
}
