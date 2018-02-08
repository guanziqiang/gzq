## 线程的创建与执行

1. 我们先从Thread着手来创建一个自己的线程，代码如下。

```
public class T1Thread extends Thread{

    public static void main(String[] args) {
        T1Thread myThread = new T1Thread();
        myThread.setName("myThread");
        myThread.start();
        System.out.println("main线程执行完成，对应的线程名称和id： " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒，以便在main线程执行完后，该线程还会在运行，方便看到结果。
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            
            System.out.println("T1Thread线程还在工作，对应的线程名称和id：" + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
    
}
```
运行上面的代码你会看到main线程结束后，我们自己定义和启动的线程还在继续工作。这样就验证了我们通过继承Thread是可以创建自己的线程的。既然要先new一个对象出来，那么肯定就需要使用要构造器。上面的例子中我们使用的是无参数的构造器。下面我们就再来看看Thread都有那些构造器可以用。  
  
2. 以下是从源代码中复制出来的Thread类的构造函数，先仔细看一下代码。

```
    public Thread() {
        init(null, null, "Thread-" + nextThreadNum(), 0);
    }
    public Thread(Runnable target) {
        init(null, target, "Thread-" + nextThreadNum(), 0);
    }
    public Thread(Runnable target, AccessControlContext acc) {
        init(null, target, "Thread-" + nextThreadNum(), 0, acc);
    }
    public Thread(ThreadGroup group, Runnable target) {
        init(group, target, "Thread-" + nextThreadNum(), 0);
    }
    public Thread(String name) {
        init(null, null, name, 0);
    }
    public Thread(ThreadGroup group, String name) {
        init(group, null, name, 0);
    }
    public Thread(Runnable target, String name) {
        init(null, target, name, 0);
    }
    public Thread(ThreadGroup group, Runnable target, String name) {
        init(group, target, name, 0);
    }
    public Thread(ThreadGroup group, Runnable target, String name,
                  long stackSize) {
        init(group, target, name, stackSize);
    }
```
看完之后你会发现它们都去调用了一个init四个参数的方法，就是下面这个。

```
    private void init(ThreadGroup g, Runnable target, String name,long stackSize) {
        init(g, target, name, stackSize, null);
    }
```
上面这个是个私有的方法，而且他还去调用了一个init有五个参数的方法，如下。

```
    private void init(ThreadGroup g, Runnable target, String name,
                      long stackSize, AccessControlContext acc) {
    //有具体实现省略
    }
```
上面这个方法终于有具体的实现了。那么我们就不用去看那么不同的构造器了，直接看这个最终调用的方法了解它的本质就行了。  

- ThreadGroup g 线程所属的线程组
- Runnable target 线程执行时调用的接口
- String name 线程的名称
- long stackSize 线程堆的尺寸
- AccessControlContext acc
上述几个参数中ThreadGroup、Runnable在线程的基础里面都会有讲。name就是字面意思，没有什么特殊含义。stackSize堆内存，一般不需要自己指定。默认为零，即由虚拟机自行处理（想要进一步了解这一部分，需要看jvm相关的知识）。AccessControlContext这玩意儿一般也不需要，和java授权内容相关线程中不会讲这个内容。那么我们就先从Runable入手。
```
public class T2Runnable implements Runnable{

    public static void main(String[] args) {
        T2Runnable target = new T2Runnable();
        Thread thread = new Thread(target );
        thread.setName("myThread");
        thread.start();
        System.out.println("main线程执行完成，对应的线程名称和id： " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒，以便在main线程执行完后，该线程还会在运行，方便看到结果。
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            
            System.out.println("myThread线程还在工作，对应的线程名称和id：" + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
    
}
```
运行上面的代码得到的结果和用T1Thread的结果一致。上面的案例中，我们只是换用了一个Thread(Runnable target)的构造器和自己创建了一个Ruuanble的子类T2Runnable。我们并没有调用run方法，但是run方法的内容确实是运行了的。那谁调用了它。虽然没有调用run但是我们调用了start方法。还是先来看看源代码，再往下分析。

```
    public synchronized void start() {
    //如果线程状态不为0（new的状态，没有start过），则抛出一个异常
        if (threadStatus != 0)
            throw new IllegalThreadStateException();
        //将线程加入到线程组中
        group.add(this);

        boolean started = false;
        try {
            start0();//调用本地方法去启动一个真实的线程
            started = true;
        } finally {
            try {
                if (!started) {
                //通知线程组启动失败
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) {
                /* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */
            }
        }
    }
    private native void start0();
```
start的逻辑我们就不分析了，自己可以看看代码和注释。重点我们需要直到本地方法start0()都干了些啥。

- 在当前调用start方法的线程中开启一个新的线程。
- 新的线程去调用thread的run方法.
这就是start主要干的事。下面我们来接着看Thread的run方法：

```
	private Runnable target;

 	@Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }
```
通过上述源代码你就能明白了。实际上Thread启动的线程也是去调用的Runable的run方法。到此为止，关于线程Thread、Runnable以及run方法和start方法的区别也就说完了。   
3. 这里在补充一点关于Thread对象和线程的区别。

```
public class T3CurrentThread extends Thread {
    @Override
    public void run() {

        System.out.println(
                "通过this打印thread的name和id " + this.getName() + " - " + this.getId());
        System.out.println("Thread.currentThread()打印thread的那么和id。 "
                + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
        System.out.println("=============");
        System.out.println("通过this打印thread的hashcode:  " + this.hashCode());
        System.out.println("通过Thread.currentThread()打印thread的hashcode:  "
                + Thread.currentThread().hashCode());
    }

    public static void main(String[] args) {
        T3CurrentThread threadObject = new T3CurrentThread();
        // 分别使用start和run查看运行的结果
        // threadObject.start();
        threadObject.run();
        System.out.println("主线程的name和id: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

}
```
通过分别只调用start或run来查看，通过this和Thread.currentThread()方法的打印结果。你会发现，只有在通过start启动一个线程之后。this与Thread.currentThread()的打印结果才会保持一致。也就是说，当没有启动线程时Thread对象仅仅就时一个普通的对象。只有通过该对象的start方法启动线程之后，它本身才会关联一个真实存在的线程。Thread.currentThread()是可以放回当前代码真实执行的线程锁关联的Thread对象的。




