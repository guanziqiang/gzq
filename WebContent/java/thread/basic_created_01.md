## 线程的创建与执行
- **Thread** 通过 init(ThreadGroup g, Runnable target, String name, long stackSize, AccessControlContext acc)构造线程对象
- **Runable接口**：方便用户实现自己的线程。
- **start()启动一个真实的线程、run()提供线程执行的内容：**
- **Thread对象不一定等于当前真实的线程：** Thread.currentThread()能返回当前正是线程的相关thread对象。


以下是从源代码中复制出来的Thread类的构造函数，先代码在分析。
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