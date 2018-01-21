# 002基础api02之线程的停止（中断）
**本节要点：**
- 自动停止与强制停止
- 线程的中断

## 自动停止与强制停止
1. 线程自己运行完run代码之后正常退出，但是有些线程是无线循环的业务需要手动停止。
2. 调用下面所示的stop方法。由于它是一个强制停止线程的操作，容易造成数据不一致等问题。所以早就过期了，不建议使用我们也就不再讨论了。
```
@Deprecated
public final void stop()
```
## 线程的中断
&emsp;&emsp;即使用interrupt()、interrupted()（或isInterrupted()）方法相互配合来实现对线程的中断。其中interrupt()是设置线程的中断标志的方法，该方法在线程等待、睡眠等一些这样的操作中会主动抛出InterruptedException异常，这给中断提供了更加灵活的策略。另外两个则是获取当前中断标志的方法，当然它们俩也有稍微的区别。我们先看案例。
```
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread() {
            @Override
            public void run() {
                int count = 0;
                while(true) {
                	//获取并清楚中断状态
                    boolean interrupted = Thread.interrupted();
                    //获取但不清楚中断状态
//                    boolean interrupted = Thread.currentThread().isInterrupted();
                    if(interrupted) {
                        System.out.println("中断状态为真："+interrupted);
                        if(count > 0) {
                            break;
                        }
                        count = 1;//发现中断标识后，再打印一次interrupt的值
                    }else {
                        System.out.println("中断状态为假："+interrupted);
                        if(count > 0) {
                            break;
                        }
                    }
                }
            }
        };
        thread.start();
        Thread.sleep(1000);//主线程休息两秒后中断副线程
        thread.interrupt();
        
    }
```
&emsp;&emsp;上述代码中。我们创建了一个匿名的Thread线程对象，start之后让主线程睡眠一秒，再去中断我们启动的线程。在run的业务逻辑中。我们不停的打印当前中断的标志信息，直到获得了中断标志为ture后再打印一次中断标志就退出当前线程。之所要在中断为ture之后再打印一次，目的是为了查看使用interrupted() 和 isInterrupted()不同的结果。  
&emsp;&emsp;运行之后你会发现。interrupted()获取到ture之后，再一次打印的结果为false；而isInterrupted()正好相反，获取到ture之后再一次打印的是true。也就是说interrupted()方法会清除中断标志，而isInterrupted()则不会。    

## 动手：
1. 大家不妨去查看一下这两个方法的源代码，看看它们之间还有什么关联。
2. 练习一下通过sleep方法抛出的中断异常来实现对线程的停止。


## 单词
interrupt \ˌin-tə-ˈrəpt\ verb 打断、中断、打扰 [计算机]中断