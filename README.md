###  项目运行需要先执行一下  
`npm install`  ||   `yarn add install`

### 安装完后运行以下：
`npm start`  ||  `yarn start`

### 该项目为一个全球新闻发布系统
主要分为两个模块：
1、用户预览模块
主要就是预览该系统发布的那些新闻，游览数量，点赞数量，新闻详情等等

2、后台登录模块
该模块主要用于新闻的发布管理，审核，发布，下线，不同的管理员有不同的权限，相对应的不同的权限对应不同的功能等

### 该项目的数据为本地存储，需要先自行安装 json-server
`npm i json-server`  || `yarn add json-server`

### 安装完成后运行 Windows PowerShell 
1.切换到文件路径src下

2.运行 json-server --watch .\db.json --port 5000  //端口号可以自定义



