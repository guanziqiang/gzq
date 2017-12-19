# 线程API基础

### 新建线程
* 创建线程的基本（还有一些其它方法，但都是以这里的方式为基础）方式
```
sequenceDiagram
A->>B: How are you?
B->>A: Great!
```


### 线程停止

### 线程的中断

## suspended 和 resume

## sychronized关键字
### synchronized
可以在任意对象及方法上加锁。而加锁这段代码称为“互斥区”或“临界区”。
当一个线程想要执行同步方法里的代码时，就会区尝试获取这个锁。只有在拿到的情况下才可以执行这部分代码。

### synchronized监视对象：
修饰方法时，默认监视对象本身。
修饰语句块时synchronized(Object) 监视指定的对象（有些情况下同步代码块效率较高）。
a，同一个监视对象的语句块和方法具有同步的锁效果。
c，对于同一个对象，其它线程可以异步调用它的非synchronized的区域。
d，可以继承父类的同步方法，但是如果重写父类方法，必须自己加上synchronized属性。不然同步属性会失效。

### synchronized监视类
修饰的静态方法，对整个类的对象都具有限制作用：public synchronized static void test1 ()
修饰的代码块synchronized (SynStatic.class)，对所指定的类同样具有监视效果，与该方法是否为静态无关。
a，对同一个对象来说其监视类和监视对象的synchronized区域是异步的关系。
b，由于静态方法是不可以重写的，所以子类调用父类的同步静态方法也是有效的(但，其同步的效果仅限于父类自己的类监视，而子类自由的类监视与父类类监视时异步的)。
总结：类监视与对象监视是异步的效果，而且对继承来说也是不会和子类的类监视同步。




脏读：
对于同一个对象，如果有一个set 和 get方法。set属于synchronized方法。
   如果一个线程在set，而有其它线程在get。那么很有可能set只执行了部分代码，数据还没有操作完成。而这些未操作完成的不完整数据被另一个线程get那走了，就会造成脏读。

不同方法同步方法，访问的随机顺序也是可以造成脏读的。也就是说，一个操作流程在做同步时，不管由几个同步方法来完成，都必须要保证整个流程的同步

锁重入：
线程可以再次获取自己已经拥有的某个对象的锁。
在继承中，子类也可以通过“可重复锁”调用父类的同步方法。

异常：
当线程发生异常时，锁自动释放。



## wait和notify、notifyAll
wait 让当前调用它的线程等待，并且会释放锁。所以wait的调用必须包含在synchronized中，因为他要获取到锁。

notify 随机唤醒一个在当前对象中等待的线程。

notifyAll  唤醒所有在当前对象中等待的线程。

## join方法：
* public final synchronized void join(long millis, int nanos)
    throws InterruptedException （这个方法有点蛋疼，看源码吧）
* public final synchronized void join(long millis)
    throws InterruptedException
* public final void join() throws InterruptedException
1. 根据源代码可知，join方法最后是通过wait()方法完成操作的。也就是说调用线程会等待被调用线程的wait队列中，直到被调用线程执行完成才会返回自身来执行剩余的部分。
2. 从上面这一点也可以判断，join方法为什么都必须要加synchronized修饰符。
3. 值得注意的是：不要在应用程序中，对Thread对象进行类似的wait()和notify()操作。这有可能会影响系统API的正常工作，或者你的操作被系统API所影响。（测试时，在thread对象上调用这两个方法抛出异常）

## yield方法：
 public static native void yield();
让当前调用的线程让出CPU，但是不代表之后不再竞争CPU资源。
volatile:
1，该属性修饰类变量（目前测试只能修饰类变量）。
2，表示被修饰属性的可预见性和顺序性。java虚拟机在处理volatile变量时，会保证它的可见性和顺序性。就是说当voletile变量改变时，虚拟机会尽快通知其它其它线程收到信息，而且虚拟机在编译指令时也会保证它的顺序性。
3，被修饰的属性不能保证数据一致性。
守护线程：
在守护线程所守护的线程全部结束时它才会结束。例如一些系统性服务，垃圾回收线程、JIT线程及可以理解为守护线程。
需要注意的时设置守护线程setDaemon(true)不能在start之后，否则程序会抛出异常，而且线程还会已用户线程继续运行。
线程优先级：
public final void setPriority(int newPriority)；
优先级最高为10 最低为 1。数值越大优先级越高。
继承性，如果A线程启动了B线程，那么B线程的优先级将与A保持一致。
线程随机性，线程A优先权 > 线程B优先权；但是并不表示A就一定先执行完成，只是A的先执行完的机会更大（还和系统平台有关）而已。
对于要求严格的场合，最好自己解决。因为对于低级别的线程可能会永远抢不到cpu，会产生线程的饥饿。
线程组：
ThreadGroup可以将一组功能类似的线程放到一起。