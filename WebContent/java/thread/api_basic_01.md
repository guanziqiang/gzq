# 002基础api01之线程的创建
**本节要点：**
- 通过继承Thread类创建自己的线程。
- 通过实现Runnable接口来创建自己的线程。
- start()方法与run()方法的区别。 
- 关于线程与对象的区别

## 通过继承Thread类来创建自己的线程。
&emsp;&emsp;先熟悉一下面的代码，我们在接着分析。
```
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("MyThread还在工作。 " + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
}

public class ExtendsThread {

    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

}
```
&emsp;&emsp;通过继承Thread类，并重写父类的run()方法我们创建了一个MyThread类。在run方法循for环了10次，每次通过Thread.sleep(2000)方法休眠2秒，并打印了当前线程的name和id值。然后在main方法中，我们创建了一个MyThread的对象，并调用了start方法。同时我们在main的结尾处也打印了当前线程的name和id值。<br>
&emsp;&emsp;运行这一段代码。你会发现，主线程（main线程）打印之后。还有一个线程每个两秒就打印一次，而且打印的name和id值都与主线程不同。很明显，我们通过继承Thread类并重写run方法就可以再启动一个新的线程来执行自己的业务逻辑（即run方法里面的代码）。这里有个问题因为java时单继承的，在实际的开发中万一我们要继承自己的业务类咋办呢？往下看……

## 通过实现Runnable接口来创建自己的线程。
&emsp;&emsp;接着上一节的问题，我们用实现的方式就可以避免这个问题了。看下面的代码。
```
public class MyRunnable implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("MyThread还在工作。 " + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
}

public class ImplementsRunnable {
    
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        Thread thread = new Thread(myRunnable);
        thread.start();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }
    
}
```
&emsp;&emsp;这次通过实现Runnable接口来创建一个MyRunnable类。同样的也需要实现run方法，代码逻辑与上面的一样。只不过，在这次的main方法中我们不但要创建一个MyRunnable类，而且通过Thread的Thread(Runnable target)构造函数创建了一个thread对象。然后在调用start方法。
&emsp;&emsp;当然运行上述的代码你会发现打印的结果与之前的时一致的。那么问题来了，为什么一定要通过thread来调start呢！为什么不能直接run呢！接着一下一节看……

## start和run区别
&emsp;&emsp;我们把两次测试的代码稍微改改。
```
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.run();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }
    
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        myRunnable.run();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }
```
&emsp;&emsp;测试MyThread类的代码我们直接调用run，测试MyRunnable的代码我们也不用Thread了直接调用run。运行之后你会发现，主线程的打印和我们自己启动（暂时当作run可以启动）的打印的线程name和id时一样的，也就是说明run根本没有启动一个线程。
&emsp;&emsp;我们先去看一下Runnable接口。
```
public interface Runnable {
    public abstract void run();
}
```
&emsp;&emsp;我们发现它就只有一个run方法在就没了，接着我们去看Thread的run和start方法和相关代码。
```
public class Thread implements Runnable {
    private Runnable target;

    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }
    
    public synchronized void start() {
        start0();
    }
    
    private native void start0();
}
```
&emsp;&emsp;上面是我摘抄的一些关键代码方便解释。首选Thread也时继承了Runable的，所以他也有自己的run实现。在target变量不为null时，调用target的run，否则就什么也不执行。这里需要说明一下，我们之前在通过Thread(myRunnable)方式创建了一个Thread,也就是说我们的myRunnable对象实际上时传递给了target的。到这里为止，我们发现无论时Thread的run方法还是Runnable的run方法实际上都是调用的Runnable的run方法。而且Runnable值没有start方法的。
&emsp;&emsp;接着我们看start方法，它实际上去调用了一个native修饰的start0()方法。也就是说，当我们调用Thread的start之后实际上java就通过start0()去调用了java的本地方法。也就是底层C锁封装的真正的启动线程的代码，而且启动的线程会自动的去调用当前Thread对象的run方法。

## 线程去对象的区别
&emsp;&emsp;在我们创建了一个Thread(或是其子类)对象时，我们并没有得到一个新的线程。只有通过调用start()方法我们才正真的开启了一个新的线程。所以要在获取当前执行代码所处的线程信息，必须时通过public static native Thread currentThread();方法得到的才是当前真实的线程信息。看下面的代码
```
public class ThreadObject extends Thread{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            
            System.out.println("MyThread还在工作1。 " + this.getName() + " - " + this.getId());
            System.out.println("MyThread还在工作2。 " + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
    
    public static void main(String[] args) {
        ThreadObject threadObject = new ThreadObject();
        //分别使用start和run查看运行的结果
//        threadObject.start();
        threadObject.run();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

}
```
&emsp;&emsp;分别只调用start和run方法。通过查看运行结果你会发现。无论run还是start方法，this.getName()和this.getId打印的内容都和主线程不一样。而Thread.currentThread().getName()和Thread.currentThread().getId()在调用run方法时，打印的时mian线程的信息。结果已经说明了，Thread对象并一定就是当前线程关联的对象。Thread.currentThread()返回就一定时当前正在执行这段代码的相关线程对象。Runnable就不用说了，它本身就并不能包含这些信息。<br>
&emsp;&emsp;练习：在上面的案例基础上，进一步验证什么时候返回的Thread.currentThread()与你创建的Thread是同一个对象。

<br><br><br># 002基础api01之线程的创建
**本节要点：**
- 通过继承Thread类创建自己的线程。
- 通过实现Runnable接口来创建自己的线程。
- start()方法与run()方法的区别。 
- 关于线程与对象的区别

## 通过继承Thread类来创建自己的线程。
&emsp;&emsp;先熟悉一下面的代码，我们在接着分析。
```
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("MyThread还在工作。 " + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
}

public class ExtendsThread {

    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

}
```
&emsp;&emsp;通过继承Thread类，并重写父类的run()方法我们创建了一个MyThread类。在run方法循for环了10次，每次通过Thread.sleep(2000)方法休眠2秒，并打印了当前线程的name和id值。然后在main方法中，我们创建了一个MyThread的对象，并调用了start方法。同时我们在main的结尾处也打印了当前线程的name和id值。<br>
&emsp;&emsp;运行这一段代码。你会发现，主线程（main线程）打印之后。还有一个线程每个两秒就打印一次，而且打印的name和id值都与主线程不同。很明显，我们通过继承Thread类并重写run方法就可以再启动一个新的线程来执行自己的业务逻辑（即run方法里面的代码）。这里有个问题因为java时单继承的，在实际的开发中万一我们要继承自己的业务类咋办呢？往下看……

## 通过实现Runnable接口来创建自己的线程。
&emsp;&emsp;接着上一节的问题，我们用实现的方式就可以避免这个问题了。看下面的代码。
```
public class MyRunnable implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("MyThread还在工作。 " + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
}

public class ImplementsRunnable {
    
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        Thread thread = new Thread(myRunnable);
        thread.start();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }
    
}
```
&emsp;&emsp;这次通过实现Runnable接口来创建一个MyRunnable类。同样的也需要实现run方法，代码逻辑与上面的一样。只不过，在这次的main方法中我们不但要创建一个MyRunnable类，而且通过Thread的Thread(Runnable target)构造函数创建了一个thread对象。然后在调用start方法。
&emsp;&emsp;当然运行上述的代码你会发现打印的结果与之前的时一致的。那么问题来了，为什么一定要通过thread来调start呢！为什么不能直接run呢！接着一下一节看……

## start和run区别
&emsp;&emsp;我们把两次测试的代码稍微改改。
```
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.run();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }
    
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        myRunnable.run();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }
```
&emsp;&emsp;测试MyThread类的代码我们直接调用run，测试MyRunnable的代码我们也不用Thread了直接调用run。运行之后你会发现，主线程的打印和我们自己启动（暂时当作run可以启动）的打印的线程name和id时一样的，也就是说明run根本没有启动一个线程。
&emsp;&emsp;我们先去看一下Runnable接口。
```
public interface Runnable {
    public abstract void run();
}
```
&emsp;&emsp;我们发现它就只有一个run方法在就没了，接着我们去看Thread的run和start方法和相关代码。
```
public class Thread implements Runnable {
    private Runnable target;

    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }
    
    public synchronized void start() {
        start0();
    }
    
    private native void start0();
}
```
&emsp;&emsp;上面是我摘抄的一些关键代码方便解释。首选Thread也时继承了Runable的，所以他也有自己的run实现。在target变量不为null时，调用target的run，否则就什么也不执行。这里需要说明一下，我们之前在通过Thread(myRunnable)方式创建了一个Thread,也就是说我们的myRunnable对象实际上时传递给了target的。到这里为止，我们发现无论时Thread的run方法还是Runnable的run方法实际上都是调用的Runnable的run方法。而且Runnable值没有start方法的。
&emsp;&emsp;接着我们看start方法，它实际上去调用了一个native修饰的start0()方法。也就是说，当我们调用Thread的start之后实际上java就通过start0()去调用了java的本地方法。也就是底层C锁封装的真正的启动线程的代码，而且启动的线程会自动的去调用当前Thread对象的run方法。

## 线程去对象的区别
&emsp;&emsp;在我们创建了一个Thread(或是其子类)对象时，我们并没有得到一个新的线程。只有通过调用start()方法我们才正真的开启了一个新的线程。所以要在获取当前执行代码所处的线程信息，必须时通过public static native Thread currentThread();方法得到的才是当前真实的线程信息。看下面的代码
```
public class ThreadObject extends Thread{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(2000);//让当前线程休眠2000毫秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            
            System.out.println("MyThread还在工作1。 " + this.getName() + " - " + this.getId());
            System.out.println("MyThread还在工作2。 " + Thread.currentThread().getName()
                    + " - " + Thread.currentThread().getId());
        }
    }
    
    public static void main(String[] args) {
        ThreadObject threadObject = new ThreadObject();
        //分别使用start和run查看运行的结果
//        threadObject.start();
        threadObject.run();
        System.out.println("main thread: " + Thread.currentThread().getName() + " - "
                + Thread.currentThread().getId());
    }

}
```
&emsp;&emsp;分别只调用start和run方法。通过查看运行结果你会发现。无论run还是start方法，this.getName()和this.getId打印的内容都和主线程不一样。而Thread.currentThread().getName()和Thread.currentThread().getId()在调用run方法时，打印的时mian线程的信息。结果已经说明了，Thread对象并一定就是当前线程关联的对象。Thread.currentThread()返回就一定时当前正在执行这段代码的相关线程对象。Runnable就不用说了，它本身就并不能包含这些信息。  
&emsp;&emsp;练习：在上面的案例基础上，进一步验证什么时候返回的Thread.currentThread()与你创建的Thread是同一个对象。

<br><br><br>