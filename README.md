# 项目和部署说明

## 依赖组件: 
- Node.js Npm
- Vue


## 安装步骤
1. 依赖库:
> npm install

2.后端对接:
> 修改vue.config.js中的后端API基准地址    

如果使用daisy_platform则不需要其它配置。

3.运行项目:    
- 线下直接使用 `npm run dev` 即可
- 线上使用`nginx`读取`dist`方式，使用 `npm run build` 编译，然后配置下Nginx: 
```
   root /www/vip.daisy.com/dist;
  
   location  ^~ /member {
       proxy_set_header X-Scheme $scheme;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header Host $http_host;
       proxy_redirect off;
       proxy_pass http://api.daisy.com;
   }
   location / {
        try_files $uri $uri/ /index.html?$query_string;
    }
```
