# 单例设计模式

## 概念
&emsp;&emsp;单例设计模式，就是要保证一个类有且仅有一个实例。

## Java的实现
&emsp;&emsp;为了要保证类只有一个实例。很容易想到的就是将构造方法私有化，同时由类自己维护一个私有的， 静态的，自身类型的成员变量。  
简易代码如下所以是。这是最简单也是最原始的实现方式，下面就各种实现方式逐一介绍。
```
private static Singleton instance = new Singleton();
private Singleton(){
	//私有化构造器
}
```
### 饿汉式
&emsp;&emsp;看下面的源代码。将类的唯一个构造器私有化。通过一个私有的静态变量管理自己的实例。外界唯一获取实例的方式就是通过公共方法。由于饿汉式是在类加载时就完成了实例的初始化工作，因此也就天生的对多线程是安全的。
```
public class T1Singleton {
	//主动创建私有的静态实例，即单例。
    private static T1Singleton instance = new T1Singleton();
    
    //私有化构造器
    private T1Singleton() {
        System.out.println("创建了一个实例");
    }
    
    //公共方法
    public static T1Singleton getInstance() {
        return instance;
    }

}
```
### 懒汉式之方法锁