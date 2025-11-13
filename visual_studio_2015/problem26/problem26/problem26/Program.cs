using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace problem26
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] arr= { 1, 2, 5, 4, 8, 12, 5, 32, 456, 65, 657, 65, 3, 1, 8, 3 };
            LinkedList<int> input = new LinkedList<int>(arr);
            int k = 5;
            int result = findKthElement(input, k);

            System.Console.Out.WriteLine(result);

        }

        static int findKthElement(LinkedList<int> list,int k)
        {            
            var last = list.GetEnumerator();
            var curr = list.GetEnumerator();

            for(int i = 0; i< k; i++)
            {
                last.MoveNext();
            }

            while (last.MoveNext())
            {
                curr.MoveNext();
            }

            curr.MoveNext();

            return curr.Current ;
        }


    }
}
