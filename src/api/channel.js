import axios from '@/libs/api.request'
/*获取列表*/
export const getChannelList = (page, pageSize) => {
  const data = {
    page: page,
    pagesize: pageSize
  }
  return axios.request({
    url: '/channels',
    params: data,
    method: 'get'
  })
}


export const getChannel = (id) => {
  return axios.request({
    url: '/channels/'+id,
    method: 'get'
  })
}
