using CRUDKnockout.DAL.DBContext;
using CRUDKnockout.Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.Business.BusinessObject
{
  public  class UserBusinessContext
    {
        UserDBContext dBContext = new UserDBContext();

        public IList<GetAllUsersDTO> GetAllUsers()
        {
            IList<GetAllUsersDTO> gdto = dBContext.GetAllUsers();
            return gdto;
        }
        

    }
}
