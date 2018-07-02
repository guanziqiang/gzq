# 单例设计模式

## 概念
&emsp;&emsp;单例设计模式，就是要保证一个类有且仅有一个实例。

## 实现
&emsp;&emsp;为了要保证类只有一个实例。很容易想到的就是将构造方法私有化，同时由类自己维护一个私有的， 静态的，自身类型的成员变量。如下所以是：
``` 
private static Singleton instance = new Singleton;
private Constructor(){
	//私有化构造器
}
```