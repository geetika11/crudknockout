using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.Shared.DTO
{
  public  class UserPaginationDTO
    {
        public IEnumerable<GetAllUsersDTO> User { get; set; }
       
        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
    }
}
