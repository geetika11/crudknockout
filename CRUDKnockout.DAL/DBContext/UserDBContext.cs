
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

        public  void DeleteUser(int UserID)
        {
            var deleteItem = dba.UserInformation.FirstOrDefault(c => c.UserID == UserID);

            if (deleteItem != null)
            {
                dba.UserInformation.Remove(deleteItem);
                dba.SaveChanges();
            }
        }
        public void UpdateUser(int UserID, string Name, string Address, string PhoneNumber)
        {
            UserInformation user = new UserInformation();
            var updateItem = dba.UserInformation.FirstOrDefault(c => c.UserID == UserID);
            if (Name != null)
            {
                updateItem.Name = Name;
            }
            if (Address != null)
            {
                updateItem.Address = Address;
            }
            if (user.PhoneNumber != null)
            {
                updateItem.PhoneNumber = user.PhoneNumber;
            }
            dba.Entry(updateItem).State = System.Data.Entity.EntityState.Modified;
            dba.SaveChanges();

          
        }
        public IList<GetAllUsersDTO> SearchUser(string SearchUser)
        {
            IList<GetAllUsersDTO> userList = new List<GetAllUsersDTO>();
            //  userList= dba.UserInformation.Where(ds => ds.Name.Contains(SearchUser));
           userList= (from u in dba.UserInformation.Where(ds => ds.Name.Contains(SearchUser))
                      select new GetAllUsersDTO()
                     {
                          UserID=u.UserID,
                         Name = u.Name,
                         Address=u.Address,
                         Age = u.Age,
                         Gender = u.Gender,
                         PhoneNumber=u.PhoneNumber
                         
             }).ToList();
            return userList;
        }

    }

}
