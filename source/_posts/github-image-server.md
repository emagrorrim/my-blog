---
title: 用Github建立一个静态图片服务器
date: 2020-04-20 14:01:31
tags: Tools
---

![Hero](https://github.com/emagrorrim/static-images/blob/master/images/v1/gift.jpg?raw=true)

平时写Markdown的时候，我们常常需要面对一个问题，就是当我们想要展示一张图片的时候，我们需要提供一个图片的URL，如下：

```markdown
![Alt](<image-url>)
```

这时我们常用的是使用一个本地的URL，指向一张本地的图片，或者在网上找到一张图片，然后使用网上图片的URL。但是当我们需要将文章发布到网上，或者发给其他人的时候，我们需要面临的是--那我们需要想办法把图片打包一起发到网上去，而且有时本地图片路径改变了，或者网络上的图片被下线了，我们都需要更新图片，不然在文章中我们便无法看到图片，进而影响文章的可读性。这时我们需要一个我们能够管理的图片服务器，并且能够提供稳定服务。

建立一个简单的静态文件服务器是一个可行的方法，但是其相对成本较高，如果使用现有的云服务（例如阿里云，亚马逊云等），可能会产生一定的费用，当然也有免费的，我们可以使用Heroku，Heroku允许每个账户免费建立5个服务，完全可以建立一个静态图片服务器。但是，建立一个服务器需要你有基本知识，部署需要的各种配置，每次添加新图片都需要你重新部署，成本相对较高。所以我在这题提供一个新思路 -- **`Github`**。

### Github Image Server

![Github](https://github.com/emagrorrim/static-images/blob/master/images/v1/github.png?raw=true)

作为我们的代码版本管理工具，其本身也有存贮的功能，平时我们的项目中也常常有一些静态图片存到Github上。而且对于每张图片，github都会提供一个单独的URL来引用这张图片，这时我们使用这张图片便能轻松通过一个固定的URL来访问。而当你复制这篇文章的时候，你也不需要担心图片丢失了。

你需要的是找到你要的图片，下载下来放在repo的目录下，commit然后push本地修改到Github远端仓库中即可。

想要获取图片的URL，可以打开你的github仓库，找到这张图片，右键选择复制图片地址，然后粘贴在你的Markdown文档中即可。Eg.

```
https://github.com/emagrorrim/static-images/blob/master/images/v1/github.png?raw=true
```

时间久了其实你就会发现，URL并不是完全随机的，其符合一个固定的模式：

```
https://github.com/<username>/<static-images-repo-name>/blob/master/<path-to-image>/<image-name>.<png|jpg|...>?raw=true
```

而对于同一个仓库来说，前面很大一部分都是固定不变的，甚至`<path-to-image>`也是固定的，于是每次其实就把新添加的图片的`<image-name>`和文件格式改一下就可以了。

### Static File Server

通过这种方式，不仅仅提供图片静态服务器，任何静态文件都可以通过这种方式存放访问。

当然其并不适合作为普通的Web Application的静态文件服务器因为需要处理跨域的问题，仅适合用Markdown写Blog之类的文章时存放图片或文件使用。

另外其也可以提供文件共享功能，但是要注意使用Github的共有仓库共享文件意味着任何人都可能访问这个文件。

### Summary

总的来说，只要你的图片或文件不涉及隐私信息，是可以被公开的，那么Github非常一个不错的工具，其能够快速，简单的帮助大家实现一个静态文件、图片服务器，而不需要你有丰富的服务器部署相关的知识。唯一需要学习的就是Github本身。
