using CRUDKnockout.Business.BusinessObject;
using CRUDKnockout.DAL;
using CRUDKnockout.DAL.DBContext;
using CRUDKnockout.Presentation.Models;
using CRUDKnockout.Shared.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CRUDKnockout.Presentation.Controllers
{
    /// <summary>
    /// how can i improve this
    /// </summary>
    public class UserController : ApiController
    {
        UserBusinessContext businessContext = new UserBusinessContext();
       
        //public class ReturnedStruct
        //{
        //    public int Total { get; set; }
        //    public string Rows { get; set; }
        //}
        [HttpGet]
        [Route("api/getallusers")]
        public IList<GetAllUsersDTO> Get( )
        {
            //where are the results visible?
            IList<GetAllUsersDTO> usersList = businessContext.GetAllUsers();
            if (usersList == null)
            {
                //var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                //{
                //    ReasonPhrase = "User List is Empty"
                //};
                //return Request.CreateErrorResponse(HttpStatusCode.BadRequest,"null");
                return null;
            }
            else
            {

                var response = Request.CreateResponse(HttpStatusCode.OK);
                //HttpContext context=new HttpContext(HttpRequest req, HttpResponse res);
                //context.Response.ContentType = "text/plain";
                //context.Response.Charset = "utf-8";
                //int pageSize = Convert.ToInt32(context.Request["pageSize"] ?? "10");
                //int pageIndex = Convert.ToInt32(context.Request["pageIndex"] ?? "1");
                //int offset = (pageIndex - 1) * pageSize;
                //string rows = JsonConvert.SerializeObject(usersList.Skip(offset).Take(pageSize).ToList());
                //int count = usersList.Count;
                //string returnedValue = JsonConvert.SerializeObject(new ReturnedStruct { Total = count, Rows = rows });
                //System.Threading.Thread.Sleep(2000);
                //context.Response.Write(returnedValue);
                //context.Response.Flush();
                return usersList;
            }         
        }

        [Route("api/user")]
        public HttpResponseMessage Post(UserDetail user)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            else if (user != null)
            {
                //how to reduce if else
                bool userstatus = businessContext.InsertUser(user);
                if (userstatus == true)
                {
                    var response = Request.CreateResponse(HttpStatusCode.Created, user);
                    //  string url = Url.Link("DefaultApi", new { user.UserID });
                    // response.Headers.Location = new Uri(url);
                    return response;
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is not Added");
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is null");
            }           
        }

        [Route("api/deleteuser/{UserID}")]
        public HttpResponseMessage Delete(int UserID)
        {
            
            bool userstatus= businessContext.DeleteUser(UserID);
            if (userstatus == true)
            {
                var response = Request.CreateResponse(HttpStatusCode.OK, UserID);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is not found");
            }
        }

        [Route("api/updateuser/{UserID}")]
    
        public IHttpActionResult Put(int UserID, UserModel user)
        {
          
            if (user != null)
            {
                string Name = user.Name;
                string Address = user.Address;
                int PhoneNumber = user.PhoneNumber;
                bool userstatus = businessContext.UpdateUser(UserID, Name, Address, PhoneNumber);
                if (userstatus == true)
                {
                   return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.OK, "updated successfully"));
                }
                else
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Not found"));
                }
            }
            else
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Not found"));
                // return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is empty");
            }
        }

        [Route("api/searchuser/{SearchString}")]
        public IHttpActionResult Put(string SearchString)
        {
            if (SearchString == null)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Search String is empty"));
            }
            else
            {
                IList<GetAllUsersDTO> usersList = businessContext.SearchUser(SearchString);
                if (usersList != null)
                {
                    return Ok(usersList);
                }
                else
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "user list is empty"));
                }
            }

        }
    }
}
