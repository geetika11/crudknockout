using CRUDKnockout.Business.Exceptions;
using CRUDKnockout.DAL;
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
            IList<GetAllUsersDTO> usersList = dBContext.GetAllUsers();
            if (usersList != null)
            {
                return usersList;
            }
            else
            {
                return null;
            }
        }
        public bool InsertUser(UserDetail user)
        {
            if (user != null)
            {
                bool userstatus = dBContext.InsertUser(user);
                return true;
            }
            else
            {
                throw new UsersException();
            }
        }
        public bool DeleteUser(int UserID)
        {
                bool userstatus = dBContext.DeleteUser(UserID);
                return true;            
        }
       
        public IList<GetAllUsersDTO> SearchUser(string SearchString)
        {
            IList<GetAllUsersDTO> usersList = dBContext.SearchUser(SearchString);
            if (usersList != null)
            {
                return usersList;
            }
            else
            {
                return null;
            }
        }


    }
}
