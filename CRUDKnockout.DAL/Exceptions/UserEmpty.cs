using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.DAL.Exception
{
    public class UserEmpty:SystemException
    {
        public UserEmpty() { }
        public UserEmpty(string message) : base(message) { }
       
    }
}
