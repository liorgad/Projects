
public static class Program
{
    public static Main(string[] args){
        IBTreeNode node = new BTreeNode();


        System.Console.WriteLine(node.IsLocked);
    }
}

interface IBTreeNode
{
    bool IsLocked ;
    void Lock();
    void Unlock();
}
class BTreeNode : IBTreeNode
{
    BTreeNode left;
    BTreeNode right;

    public bool IsLocked { get; private set; }
    public void Lock()    {}
    public void Unlock() {}

}