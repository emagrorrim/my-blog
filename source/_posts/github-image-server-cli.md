---
title: 用Github建立一个静态图片服务器 -- 上传CLI
date: 2020-05-06 14:01:31
tags: Tools
---

上次说道，我们用`Github`建立了一个服务器，我们把图片放到你的仓库代码库下，然后将图片push到Github远端服务器上，之后就可以访问你的图片了。这次，我们试着自动化这些步骤。

想要自动话这个步骤，我们需要写一些代码，这里我选择了`Node.js`，可以提供一些工具来操作文件还有下载图片。并且在也很容易在本地运行。并且`Node.js`也支持运行Shell Script。

下面我们将这个流程分为下面几个步骤：

1. 从命令行读取参数
2. 下载图片并存到设定的路径下
3. 将图片push到Github的远端仓库下

### 从命令行读取参数

`Node.js`命令如下所示

```shell
node upload.js --url https://any-image-host.com/static/images/image.png
```

之后我们可以读取到URL参数并用来下载图片到Github仓库下。

通常，我们可以从`process.argv`来读取这些参数，但是读取的参数可读性较低，因为数据是存在数组里的，如下文所示：

```js
[
  '/<path>/node',
  '/<path>/upload.js',
  '--url',
  'https://any-image-host.com/static/images/image.png'
]
```

所以我建议使用一个工具`minimist`，你可以通过`npm`来安装，`npm i minimist --save`。这个工具可以帮你将参数整理成键值对的形式：

```js
{
  _: [
    '/<path>/node',
    '/<path>/upload.js'
  ],
  url: 'https://any-image-host.com/static/images/image.png'
}
```

之后我们可以轻松的从`minimist(process.argv).url`来获取数据。

### 下载图片并存到设定的路径下

拿到图片的URL，我们就可以准备下载图片了。

首先，选择一个路径来存储图片，我比较倾向于下面这样的路径：

```
<project-path>/images/<timestamp>/<uuid>.<image-format>
```

首先我们需要创建文件夹`<project-path>/images/<timestamp>`，这里我们可以用shell script `mkdir -p <project-path>/images/<timestamp>`，但是我们在`Node.js`中使用shell script吗？答案是：是的，我们可以通过下面打代码来运行shell script。

```js
const exec = require('child_process').exec;

const sh = cmd => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
```

首先，从`child_process`模块中引入`exec`方法，这个模块是包括在`Node.js`中，我们不需要再另外安装。然后他可以接受一个shell script命令作为参数并执行它。

在这里我们只需要执行`sh('mkdir -p <project-path>/images/<timestamp>')`，文件夹便被创建出来了。

之后，我们便可以下载图片了。这里我们使用了`image-downloader`模块，通过`npm i image-downloader --save`可以安装它。其API使用方式比较简单，eg.

```js
  const downloader = require('image-downloader')
  const options = {
    url,
    dest: path.resolve(__dirname, `${dir}/${name}`),
    extractFilename: false,
  }
  return downloader.image(options)
    .then(({ filename, image }) => {
      console.log('The image is saved to', filename);
      console.log('The image is at', `https://raw.githubusercontent.com/<your-git-username>/static-images/master/images/v2/${timestamp}/${name}`);
    })
```

如果你想了解更多关于`image-downloader`的内容, 可以访问[https://www.npmjs.com/package/image-downloader](https://www.npmjs.com/package/image-downloader)

### 将图片push到Github的远端仓库下

拿到图片后，最后一步就是发布这些图片。

这步很简单，因为我们前面已经配置好`sh`方法来执行命令行脚本，我们我们可以如下配置命令：

```js
const command = `
  git add --all; \
  git commit -m "Add image"; \
  git push origin master});
`
sh(command)
```

之后如果你的Git工作正常，应该可以看到你的图片已经被发布到Github上了。

### 疑难排解

我在这个过程中面对的最大的问题是在下载图片的时候，有时候会遇到`CONNECTION REFUSED 0.0.0.0:443`的错误，但是将URL输入到浏览器中则可以看到图片，这种情况下是由于DNS不能正确的解析域名导致的，你可以尝试换一个DNS服务器比如`114.114.114.114`，如果你觉得这样比较费时间，对于这样的图片你也可以手动下载。
