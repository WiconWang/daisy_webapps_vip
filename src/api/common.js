import axios from '@/libs/api.request'


export const uploadImage = (data) => {
  return axios.request({
    url: '/upload/image',
    data:data,
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post'
  })



  // let config = {
  //   headers: {'Content-Type': 'multipart/form-data'}
  // };
  // return axios.post('/upload/image', data, config);
}
