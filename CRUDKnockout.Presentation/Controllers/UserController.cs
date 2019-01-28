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

        [Route("api/user")]
        //to add the user
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
                    return response;
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "User is not Added");
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "User is null");
            }           
        }

        [HttpPost]
        [Route("api/edituser/{ID}")]
        public HttpResponseMessage PutCustomer(int ID, UserModel user)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (ID != user.ID)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is not found");
            }
            UserDBContext userdb = new UserDBContext();
            GetAllUsersDTO updateduser = new GetAllUsersDTO();
            updateduser.Address = user.Address;
            updateduser.Age = user.Age;
            updateduser.ID = ID;
            updateduser.Name = user.Name;
            updateduser.PhoneNumber = user.PhoneNumber;
            updateduser.Gender = user.Gender;
            var response= userdb.update(ID, updateduser);
            if (response == true)
            {
                return Request.CreateErrorResponse(HttpStatusCode.OK, "User is updated successfully");
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "User is not updated");
            }
        }

        //Represents a HTTP response message including the status code and data...old way
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
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "User is not found");
            }
        }

        //it can support html with razor, new way, how a new response should be treated
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
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "user list is empty"));
                }
            }
        }
    }
}
