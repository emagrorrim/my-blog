# Alamofire Note
![](https://raw.githubusercontent.com/emagrorrim/static-images/master/images/v1/Alamofire/15322346652322.png)
## Overview
- Category
- Language
- Positioning
- Considerations
- Suggestion for you

<!-- more -->

## Category
Networking framework

## Language
<img src="https://raw.githubusercontent.com/emagrorrim/static-images/master/images/v1/Alamofire/15322376597183.png" width=200px />

## Positioning
**Tool rather than component**
On this point, Alamofire has a lot encapsulated behavior but all these behavior can be chosen by developer if we want to invoke them. Eg.

```swift
// request with validation, default validation is statusCode 200..<300 and contentType.
Alamofire.request(url).validate().response { response in
  if let error = response.result.error {
    // Handle error
    return
  }
  // Handle response.result.value
}

// request without validation
Alamofire.request(url).response { response in
  if let error = response.result.error {
    // Handle error
    return
  }
  // Handle response.result.value
}
```
As we can see here, we receive a 404 response, the first one will execute into `if let`, the second one will not, the second one will handle response directly.

## Considerations
- How would this work when interfacing with our legacy objective C code?
- Does it do Image caching? What is the interface like?
- How quickly do they update to new versions of Swift? Are we likely to get blocked from upgrading once a new version of Swift is released?
- What are the advantages Alamofire provides over URLSession?  (One is image caching). Are the advantages easy to re-write ourselves and maintain?

### 1.How would this work when interfacing with our legacy objective C code?
First thing, we **cannot** use it directly in OC code, but we can encapsulate Alamofire by a swift class which inherit `NSObject`, following method can be called in Objective-C

```swift
class AlamofireNetworkClient: NSObject {
  @objc func fetchData(completion: @escaping ([String: Any]) -> Void) {
    Alamofire
        .request("https://httpbin.org/get", method: .get, parameters: [:], encoding: URLEncoding.default, headers: nil)
        .responseJSON { response in
          switch response.result {
          case .success(let value):
            let data = value as? [String: Any] ?? [:]
            completion(data)
          case .failure(let error):
            print(error.localizedDescription)
          }
        }
  }
}
```

### 2.Does it do Image caching? What is the interface like?
We have another framework called `AlamofireImage`(GitHub address: https://github.com/Alamofire/AlamofireImage), which provide the ability to fetch the image and also cache image with following code.

**Download**

```swift
import Alamofire
import AlamofireImage

Alamofire.request("https://httpbin.org/image/png").responseImage { response in
  if let image = response.result.value {
    print("image downloaded: \(image)")
  }
}
```
**Cache**
`AutoPurgingImageCache` is only a memory cache, `ImageDownloader` can save to disk, the api name is same with `UIKit+AFNetworking`, but it still need a wrapper, we can not use this directly in OC

```swift
try? UIImageView.af_sharedImageDownloader.download(URLRequest(url: "https://cdn.dribbble.com/users/11867/screenshots/4160757/sonic_1x.jpg", method: .get), completion: { (response) in
        if let image = response.result.value {
          print("image downloaded: \(image)")
          completion(image)
        }
      })
```
```swift
let imageCache = AutoPurgingImageCache()
let avatarImage = UIImage(data: data)!

// Add
imageCache.add(avatarImage, withIdentifier: "avatar")

// Fetch
let cachedAvatar = imageCache.image(withIdentifier: "avatar")

// Remove
imageCache.removeImage(withIdentifier: "avatar")
```
This framework also provide some func to operate the image like add filter or change image size

### 3.How quickly do they update to new versions of Swift? Are we likely to get blocked from upgrading once a new version of Swift is released?
- 17-6-2017: 4.5.0, Alamofire to build with Xcode 9 with Swift 3.2 and 4.0 in addition to Xcode 8.3 and Swift 3.1.
- 7-9-2017: 4.5.1, The project to work with Xcode 9 beta 6 on Swift 3.2 and 4.0.

Seems they update very quick and also they merge PR quick often
![image](https://raw.githubusercontent.com/emagrorrim/static-images/master/images/v1/Alamofire/git-issues.png)

### 4.What are the advantages Alamofire provides over URLSession? 
#### Alamofire
Advantage:

- Support image cache
- We don't need to care about too many implementation details.
- Alamofire Github is activity

Disadvantage:

- It possibly has some API we can not use in OC which we don't find when spike
- Third-part Framework still has risk we need change it in the future.
- Has duplicated `Result` enum

#### URLSession
Advantage:

- Designed by Apple, so we don't need care about updating
- Supporting we custom more details, meanwhile, it's a disadvantage
- No need to concern about `Result` issue
- Compatible with OC

Disadvantage:

- Need more effort working on this
- We need figure out another way to do image caching

## Now I have following options
### Alamofire + AlamofireImage (Recommended)
#### Good
- Using Alamofire and AlamofireImage, which should be the easiest way to do this, we don't need care about the network itself, we can use them replace AFNetworking directly.
- Alamofire Github is activity
#### Bad
- Third-part Framework still has risk we need change it in the future.

### URLSession + Alamofire + AlamofireImage
#### Good
- Using URLSession to implementation network layer, extracting image caching out of the main project, then use Alamofire and AlamofireImage to implement image caching. So we can control the implementation.
- We don't need to care about OC compatibility or new swift version release
#### Bad
- We need a module only for image caching
- We need to implement get, post method by ourselves

### URLSession + KingFisher(image caching)
It's almost same with previous one, just we are not going to implement image caching by Alamofire, we using another framework called `KingFisher` which is quite similar to `SDWebImage`, here is the Github URL: https://github.com/onevcat/Kingfisher

### URLSession + implement image caching by ourselves(Not Recommended)
