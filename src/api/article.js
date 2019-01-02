import axios from '@/libs/api.request'


export const addArticle = (data) => {
  return axios.request({
    url: '/articles',
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
    url: '/articles',
    params: data,
    method: 'get'
  })
}

export const getArticle = (id) => {
  return axios.request({
    url: '/articles/'+id,
    method: 'get'
  })
}

export const editArticle = (data , aid) => {
  return axios.request({
    url: '/articles/'+ aid,
    data,
    method: 'put'
  })
}

export const delArticle = (id) => {
  return axios.request({
    url: '/articles/'+id,
    method: 'delete'
  })
}


export const saveArticleStatus = (id,status) => {
  const data = {
    status: status
  }
  return axios.request({
    url: '/status/articles/'+id,
    data,
    method: 'patch'
  })
}
