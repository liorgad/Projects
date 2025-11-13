using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace problem27
{
    class Program
    {
        static char[,] brs = {
            { '(', ')' },
             { '[', ']' },
            { '{', '}' }
            };

        static Stack<Tuple<int, int>> stack = new Stack<Tuple<int, int>>();
        static void Main(string[] args)
        {
            string test1 = "([])[]({})";
            string test2 = "([)]";
            string test3 = "((()";

            var result = ValidateBrackets(test1);

            Console.Out.WriteLine("test {0} result {1}", test1, result);

            result = ValidateBrackets(test2);

            Console.Out.WriteLine("test {0} result {1}", test2, result);

            result = ValidateBrackets(test3);

            Console.Out.WriteLine("test {0} result {1}", test3, result);
        }

        static bool ValidateBrackets(string expr)
        {
            var charArr = expr.ToCharArray();

            var chType = brType(charArr[0], brs);
            if (null == chType || charArr[0] == brs[chType.Item1,1])
            {
                return false;
            }

            stack.Push(chType);

            for(int i = 1; i < charArr.Length;i ++)
            {
                chType = brType(charArr[i], brs);
                if(null == chType)
                {
                    continue;
                }

                if (brs[chType.Item1, 0] == brs[chType.Item1, chType.Item2])
                {
                    stack.Push(chType);
                    continue;
                }

                var currBr = stack.Peek();

                if(brs[currBr.Item1,1] == brs[chType.Item1, chType.Item2])
                {
                    stack.Pop();
                    continue;
                }
                

                return false;                
            }

            return stack.Count == 0;
        }

        

        static Tuple<int, int> brType(char br,char[,] brs)
        {
            for(int i=0;i < brs.Length; i++)
            {
                for(int j=0;j<2;j++)
                {
                    if(br == brs[i,j])
                    {
                        return new Tuple<int,int>(i,j);
                    }
                }
            }
            return null;
        }
    }
}
