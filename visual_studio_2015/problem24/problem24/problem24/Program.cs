using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace problem24
{
    class Program
    {
        static void Main(string[] args)
        {
            IBTreeNode node = new BTreeNode();


            System.Console.Out.WriteLine(node.IsLocked);
        }
    }

    interface IBTreeNode
    {
        bool IsLocked { get; set; }
        void Lock();
        void Unlock();
    }
    class BTreeNode : IBTreeNode
    {
        BTreeNode left;
        BTreeNode right;

        public bool IsLocked { get; set; }
        public void Lock() { }
        public void Unlock() { }

    }
}
