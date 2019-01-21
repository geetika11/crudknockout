using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.Business.Exceptions
{
  public  class UsersException:Exception
    {
        public UsersException() { }
        public UsersException(string message) : base(message) { }
        public UsersException(string message, Exception inner) : base(message, inner) { }
    }
}
