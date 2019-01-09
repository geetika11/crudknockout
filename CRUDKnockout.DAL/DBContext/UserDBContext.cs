
using CRUDKnockout.Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.DAL.DBContext
{
   public class UserDBContext
    {

      private  MVCCRUDKNOCKOUTEntities dba = new MVCCRUDKNOCKOUTEntities();


        public IList<GetAllUsersDTO> GetAllUsers()
        {
            IList<GetAllUsersDTO> userList = new List<GetAllUsersDTO>();
            userList = (from u in dba.UserInformation
                        select new GetAllUsersDTO()
                        {
                            UserID = u.UserID,
                            Address = u.Address,
                            Name=u.Name,
                            Age=u.Age,
                            Gender=u.Gender,
                            PhoneNumber=u.PhoneNumber

                        }).ToList();

            return userList;            
        }
        public  void InsertUser(UserInformation user)
        {
            dba.UserInformation.Add(user);
            dba.SaveChanges();
        }

    }

}
