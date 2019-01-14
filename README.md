# install

## 依赖组件: 
- Node v9.10 以上
- npm v5.6 以上
- Nginx 

### dev
修改vue.config.js中的代理链接 
直接使用 npm run dev即可


### prod
线上使用nginx代理方案,npm run build编译出dist，   
1. git检出项目  
2. 执行以下命令
> npm run build  

另外，此命令在 git项目有变动时，均需要执行一次。

1.修改提交路径   src/config/index.js 中prod值
3. 配置文件：src/config/index.js中    
uploadBase，请更改为项目API的访问网址：
> uploadBase: 'http://api.xxx.com.xxxx:8888/'

prod，请更改为项目API对应目录

4. 对本站点配置nginx，根目录指向本项目下的dist，此目录会在第2条命令时生成
```
   root /www/wwwroot/xxx/xxx/dist;
  
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

部署完成以后，http://域名/ 可打开网站登陆页面，并使用超管后台开放的帐号密码进行登陆。
