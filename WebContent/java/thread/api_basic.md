# 线程API基础
本节将从java的API角度触发，从线程的新建、停止、中断、挂起、等待与唤醒、加入、让步、易变的、守护、同步这几个方面逐一介绍。



## 线程的创建
- 创建线程并启动一个线程，如下代码所示。我们在main函数中新建了一个Thread对象，并调用了start()方法。运行此段代码除了最后打印的main thread end.之外，我们看不到其它任何效果。

```
    public static void main(String[] args) {
		Thread thread = new Thread();
		thread.start();
		System.out.println("main thread end.");
	}
```
- 由此引发出一个问题，启动start()方法之后干了啥。我们去查看源码发现。首先，它（public synchronized void start()）是一个由synchronized修饰的无返回值的方法。进一步查看其逻辑，其核心的部分是调用了一个start0()（private native void start0();）方法。start0()是一个本地方法，也就是说其底层由第三方语言（C、C++）实现。这里我们就不再进一步深入了，但是调用这个方法后会导致一个结果，那就是会触发run方法。下面我们自己继承Thread来实现一个自己的线程查看运行的效果。
```
public class MyThread extends Thread{
	@Override
	public void run() {
		System.out.println("My Thread run().");
	}
	
	  // 测试方法
	public static void main(String[] args) {
		MyThread myThread = new MyThread();
		myThread.start();
		System.out.println("main thread end.");
	}
}
```
运行上面的代码我们得到如下的打印结果（由于线程是并发的，所以运行的打印结果可能不一样）：<br>
**main thread end.**<br>
**My Thread run().**<br> 
从代码中我们可以看到。我们并没有调用run方法。但是运行的结果确实是执行了MyThread的run方法。即通过集成Thread类，并重写run方法可以实现我们自己的线程。
* 现在我们在考虑一个问题，如果MyThread类还需要继承一个实际开发中的业务类。由于java不能有多继承，所以就没办法实现多个继承了。我们可能就会想到implements的方式。
* 下面我们来看一下Thread的run方法：
``` 
    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }
```
thread的run方法也是覆盖的，而且还有个target变量。查看Thread的声明class Thread implements Runnable得知它继承了一个Runnable接口，而且target就是一个Runnbale变量（private Runnable target;）。看如下代码实现。
```
class MyRunnbale implements Runnable{

	@Override
	public void run() {
		System.out.println("My Runnable run().");
	}
	//测试方法
	public static void main(String[] args) {
		Thread thread = new Thread(new MyRunnbale());
		thread.start();
		System.out.println("main thread end.");
	}
	
}
```
你运行一下程序会发现也是可以执行run方法的。这里我们使用了public Thread(Runnable target)构造器，来实现自己的线程。
* 需要注意的是，直接使用run是不能启用一个新线程的。看下面的代码。
```
class FalseThread extends Thread{
	@Override
	public void run() {
		System.out.println("直接启用run的线程名称：" + Thread.currentThread().getName());
	}
}
class TureThread extends Thread{
	@Override
	public void run() {
		System.out.println("通过start方法启用run的线程名称：" + Thread.currentThread().getName());
	}
}
    //测试方法
	public static void main(String[] args) {
		new TureThread().start();
		new FalseThread().run();
		System.out.println("main thread name: " + Thread.currentThread().getName());
		System.out.println("main thread end.");
	}
```
运行测试我们会得到如下的打印结果。<br>
**通过start方法启用run的线程名称：Thread-0** <br>
**直接启用run的线程名称：main** <br>
**main thread name: main** <br>
**main thread end.** <br>
你会发现直接启用run方法的线程名称和mian函数的线程的名称是一样的。这就证明了直接启用run方法是不会单独启动一个线程的。（Thread.currentThread().getName()：通过获取线程的示例，再获取线程的名称）
* 这里顺带提一下线程内部的一个枚举值（即线程的各类状态）
```
    public enum State {
        //表示一个尚未启动的线程。
        NEW,

        // 一个可运行的线程。但是它不一定正在执行。
        RUNNABLE,

        // 阻塞的状态。
        BLOCKED,

        //无时间限定的等待
        WAITING,

        //有限时间内等待
        TIMED_WAITING,

        //线程结束的状态
        TERMINATED;
    }
```

## 线程停止

## 线程的中断

## suspended 和 resume

## sychronized关键字
* synchronized
可以在任意对象及方法上加锁。而加锁这段代码称为“互斥区”或“临界区”。
当一个线程想要执行同步方法里的代码时，就会区尝试获取这个锁。只有在拿到的情况下才可以执行这部分代码。
* synchronized监视对象：
修饰方法时，默认监视对象本身。
修饰语句块时synchronized(Object) 监视指定的对象（有些情况下同步代码块效率较高）。
a，同一个监视对象的语句块和方法具有同步的锁效果。
c，对于同一个对象，其它线程可以异步调用它的非synchronized的区域。
d，可以继承父类的同步方法，但是如果重写父类方法，必须自己加上synchronized属性。不然同步属性会失效。
* synchronized监视类
修饰的静态方法，对整个类的对象都具有限制作用：public synchronized static void test1 ()
修饰的代码块synchronized (SynStatic.class)，对所指定的类同样具有监视效果，与该方法是否为静态无关。
a，对同一个对象来说其监视类和监视对象的synchronized区域是异步的关系。
b，由于静态方法是不可以重写的，所以子类调用父类的同步静态方法也是有效的(但，其同步的效果仅限于父类自己的类监视，而子类自由的类监视与父类类监视时异步的)。
总结：类监视与对象监视是异步的效果，而且对继承来说也是不会和子类的类监视同步。
* 脏读：
对于同一个对象，如果有一个set 和 get方法。set属于synchronized方法。
   如果一个线程在set，而有其它线程在get。那么很有可能set只执行了部分代码，数据还没有操作完成。而这些未操作完成的不完整数据被另一个线程get那走了，就会造成脏读。
不同方法同步方法，访问的随机顺序也是可以造成脏读的。也就是说，一个操作流程在做同步时，不管由几个同步方法来完成，都必须要保证整个流程的同步
* 锁重入：
线程可以再次获取自己已经拥有的某个对象的锁。
在继承中，子类也可以通过“可重复锁”调用父类的同步方法。
* 异常：
当线程发生异常时，锁自动释放。



## wait和notify、notifyAll
- wait 让当前调用它的线程等待，并且会释放锁。所以wait的调用必须包含在synchronized中，因为他要获取到锁。

- notify 随机唤醒一个在当前对象中等待的线程。

- notifyAll  唤醒所有在当前对象中等待的线程。

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

## volatile:
1，该属性修饰类变量（目前测试只能修饰类变量）。
2，表示被修饰属性的可预见性和顺序性。java虚拟机在处理volatile变量时，会保证它的可见性和顺序性。就是说当voletile变量改变时，虚拟机会尽快通知其它其它线程收到信息，而且虚拟机在编译指令时也会保证它的顺序性。
3，被修饰的属性不能保证数据一致性。

## 守护线程：
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