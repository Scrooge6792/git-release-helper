# git-release-helper

这是一个协助开发人员提交代码的脚本。

## 功能

- 自动执行一系列的git命令
- 自动构建代码
- 自动登录ssh服务器并发布版本

## 背景

摆脱繁琐的手动发版步骤，我们可以利用脚本去帮助处理这些事情

> 如果有更为复杂详细的步骤，或者想要有更优的方案，可以采用持续集成（CI）

## 安装

> 推荐安装到全局
```sh
$ npm install -g git-release-helper
```

## 使用说明

###1. 创建配置文件生成`grhconfig.json`文件，然后修改内容

```sh
$ cd myProject && grh init
```

```json
{
  "SSHConfigPath": "D:\\myProject\\ssh.json",
  "outputPath": "/build"
}
```

其中构建步骤会执行`npm run build`，`outputPath`对应webpack的output路径。

`ssh.json`请单独存在项目外，内容如下

```json
{
  "connectionOptions":  {
    "host": "127.0.0.1",
    "username": "admin",
    "password": "admin"
  },
  "commands": {
    "myProject": "cd /srv/app/myProject\ngit pull origin prod\nexit\n"
  }
}
```

###2. 在`.gitignore`上添加`grhconfig.json`

###3. 愉快地推代码

```sh
$ cd myProject && grh
```

## 维护者

[@Scrooge6792](https://github.com/Scrooge6792).

## 如何贡献

非常欢迎你的加入！ [提一个Issue](https://github.com/Scrooge6792/git-release-helper/issues/new) 或者提交一个 Pull Request。
