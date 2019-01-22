
using CRUDKnockout.DAL.Exception;
using CRUDKnockout.Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.DAL.DBContext
{
   public class UserDBContext:IDisposable
    {
        public IList<GetAllUsersDTO> GetAllUsers()
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                IList<GetAllUsersDTO> userList = new List<GetAllUsersDTO>();
                userList = (from u in dbEntities.UserDetail
                            select new GetAllUsersDTO()
                            {
                                UserID = u.ID,
                                Address = u.Address,
                                Name = u.Name,
                                Age = u.Age,
                                Gender = u.Gender,
                               PhoneNumber=u.PhoneNumber
                            }).ToList();

                if (userList.Count > 0)
                {
                    return userList;
                }
                else
                {
                    return null;
                }
            }           
        }
        public bool InsertUser(UserDetail user)
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                
                dbEntities.UserDetail.Add(user);
                dbEntities.SaveChanges();
                return true;
            }
        }

        public  bool DeleteUser(int UserID)
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                var deleteItem = dbEntities.UserDetail.FirstOrDefault(c => c.ID == UserID);

                if (deleteItem != null)
                {
                    dbEntities.UserDetail.Remove(deleteItem);
                    dbEntities.SaveChanges();
                    return true;
                }
                else return false;
            }
        }
        public bool UpdateUser(int UserID, string Name, string Address, int PhoneNumber)
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                UserDetail user = new UserDetail();
                var updateItem = dbEntities.UserDetail.FirstOrDefault(c => c.ID == UserID);
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
                dbEntities.Entry(updateItem).State = System.Data.Entity.EntityState.Modified;
                dbEntities.SaveChanges();
                return true;
            }
          
        }
        public IList<GetAllUsersDTO> SearchUser(string SearchUser)
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                IList<GetAllUsersDTO> userList = new List<GetAllUsersDTO>();
                //  userList= dba.UserDetail.Where(ds => ds.Name.Contains(SearchUser));
                userList = (from u in dbEntities.UserDetail.Where(ds => ds.Name.Contains(SearchUser))
                            select new GetAllUsersDTO()
                            {
                                UserID = u.ID,
                                Name = u.Name,
                                Address = u.Address,
                                Age = u.Age,
                                Gender = u.Gender,
                               
                            }).ToList();
                if (userList.Count>0)
                {
                    return userList;
                }
                else
                {
                    return null;
                }
            }
        }

        public UserDetail getUser(int id)
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                UserDetail user = dbEntities.UserDetail.Where(ds => ds.ID == id).FirstOrDefault();
                return user;
            }
        }
        public void Dispose()
        {
            Dispose();
            GC.SuppressFinalize(this);
        }

       
    }

}
