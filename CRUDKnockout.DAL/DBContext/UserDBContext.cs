
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
                                ID = u.ID,
                                Address = u.Address,
                                Name = u.Name,
                                Age = u.Age,
                                Gender = u.Gender,
                               PhoneNumber=u.PhoneNumber
                            }).ToList();
                var abc = userList.Count;

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

        public bool update(int id, GetAllUsersDTO user)
        {
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                var updateItem = dbEntities.UserDetail.FirstOrDefault(c => c.ID == id);
                updateItem.Address = user.Address;
                updateItem.Age = user.Age;
                updateItem.Name = user.Name;
                updateItem.PhoneNumber = user.PhoneNumber;
                updateItem.Gender = user.Gender;
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
                userList = (from u in dbEntities.UserDetail.Where(ds => ds.Name.Contains(SearchUser))
                            select new GetAllUsersDTO()
                            {
                                ID = u.ID,
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
        public UserPaginationDTO getTenUser(int currentPage)
        {
            int maxRows = 10;
            using (MVCCRUDKNOCKOUTEntities dbEntities = new MVCCRUDKNOCKOUTEntities())
            {
                UserPaginationDTO userPaginationDTO = new UserPaginationDTO();
               // userPaginationDTO = dbEntities.UserDetail.OrderBy(ds => ds.ID).Skip((currentPage - 1) * maxRows).Take(maxRows);
                userPaginationDTO.User = (from ds in dbEntities.UserDetail
                                     select new GetAllUsersDTO() {
                                     ID=ds.ID,
                                     Address=ds.Address,
                                     Age=ds.Age,
                                     Name=ds.Name,
                                     Gender=ds.Gender,
                                     PhoneNumber=ds.PhoneNumber})                                                
                            .OrderBy(ds => ds.ID)
                            .Skip((currentPage - 1) * maxRows)
                            .Take(maxRows).ToList();

                double pageCount = (double)(dbEntities.UserDetail.Count() / Convert.ToDecimal(maxRows));
                userPaginationDTO.PageCount = (int)Math.Ceiling(pageCount);
                userPaginationDTO.CurrentPage = currentPage;
                return userPaginationDTO;
            }

        }

        public void Dispose()
        {
            Dispose();
            GC.SuppressFinalize(this);
        }

       
    }

}
