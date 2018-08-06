---
title: Swift如何获得一个字符的unicode值
date: 2017-09-18 21:09:43
tags: iOS
categories: Software
---
```swift
var myString = "x"
for scalar in myString.unicodeScalars {
  print("\(scalar.value) ")
}
```
