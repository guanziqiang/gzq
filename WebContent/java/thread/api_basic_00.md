# 基础API最少必要概念
- 线程创建与执行
- 线程的停止
- 线程的暂停（等待）与继续（唤醒）
- synchronized
- volatile
- yield(让步)
- sleep（睡眠）
- setDaemon（守护）
- setPriority（优先级）
- ThreadGroup（线程组）


## 线程的创建与执行
- **Thread** 通过 init(ThreadGroup g, Runnable target, String name, long stackSize, AccessControlContext acc)构造线程对象
- **Runable接口**：方便用户实现自己的线程。
- **start()启动一个真实的线程、run()提供线程执行的内容：**
- **Thread对象不一定等于当前真实的线程：** Thread.currentThread()能返回当前正是线程的相关thread对象。


## 线程的停止
- **自动停止与stop强制停止** 
- **线程的中断** interrupt()、public boolean isInterrupted()、public static boolean interrupted()（清除状态）

## - 线程的暂停（等待）与继续（唤醒）

## sychronized关键字
- synchronized在监视区域具有同步功能，能监视动态和静态方法；能监视Object.class和this。


## yield方法：
- public static native void yield();
让当前调用的线程让出CPU，但是不代表之后不再竞争CPU资源。

## sleep方法
- public static native void sleep(long millis) throws InterruptedException;
- public static void sleep(long millis, int nanos) throws InterruptedException 

## volatile:
1，该属性修饰类变量（目前测试只能修饰类变量）。
2，表示被修饰属性的可预见性和顺序性。java虚拟机在处理volatile变量时，会保证它的可见性和顺序性。就是说当voletile变量改变时，虚拟机会尽快通知其它其它线程收到信息，而且虚拟机在编译指令时也会保证它的顺序性。
3，被修饰的属性不能保证数据一致性。

## 守护线程：
需要注意的时设置守护线程setDaemon(true)不能在start之后，否则程序会抛出异常，而且线程还会已用户线程继续运行。

## 线程优先级：
public final void setPriority(int newPriority)；
优先级最高为10 最低为 1。数值越大优先级越高。
继承性，如果A线程启动了B线程，那么B线程的优先级将与A保持一致。
线程随机性，线程A优先权 > 线程B优先权；但是并不表示A就一定先执行完成，只是A的先执行完的机会更大（还和系统平台有关）而已。
对于要求严格的场合，最好自己解决。因为对于低级别的线程可能会永远抢不到cpu，会产生线程的饥饿。


## 线程组：
ThreadGroup可以将一组功能类似的线程放到一起。