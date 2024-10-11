<p align="center">
    <img src="./build/appicon.png" width="138px" />
</p>
<h1 align="center">Holmenga</h1>
<p align="center">
    <strong>
        帮助你整理下载的漫画资源的小工具
    </strong>
</p>

## 简介

项目名来源于 Holmes（福尔摩斯）与 mange （漫画）的结合。

如果你对手中漫画图片乱序感到头痛，那么你可能需要这个程序。

## 功能

- 对文件夹内的图片排序并根据序号对文件重命名
- 对整理好的漫画资源进行 zip 压缩
- 自动删除进行 zip 压缩的源文件

**注意：程序执行过程中会对源文件进行直接操作，请提前做好备份**

## 安装

你需要自行配置 node 18.20+ 与 go 1.20+ 的开发环境。
项目基于 wails 开发，详细内容请阅读[官方文档](https://wails.io/zh-Hans/docs/introduction)

安装 wails：

```sh
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

安装前端依赖：

```sh
cd ./frontend
yarn
```

本地开发：

```sh
wails dev
```

项目构建：

```sh
wails build
```
