using CRUDKnockout.Business.BusinessObject;
using CRUDKnockout.DAL;
using CRUDKnockout.DAL.DBContext;
using CRUDKnockout.Presentation.Models;
using CRUDKnockout.Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Services;
using System.Web.Services;

namespace CRUDKnockout.Presentation.Controllers
{
    public class UserController : ApiController
    {
        UserBusinessContext ubc = new UserBusinessContext();
        UserDBContext udb = new UserDBContext();
        [HttpGet]
        [Route("api/getallusers")]
        public IList<GetAllUsersDTO> Get()
        {
            IList<GetAllUsersDTO> gd = ubc.GetAllUsers();
            return gd;
        }

        //[HttpDelete]
        //[Route("api/deleteuser/{UserID}")]
        //public bool Delete(string UserID)
        //{
        //    return ubc.DeleteUser(UserID);
        //}


        //[HttpPut]
        //[Route("api/edituser")]
        //public bool Put([FromBody] NewUserModel model)
        //{
        //    NewTweetDTO dto = new NewTweetDTO();
        //    dto.UserID = Guid.Parse(model.UserID);
        //    dto.TweetID = model.TweetID;
        //    dto.Message = model.Message;
        //    return ubc.UpdateUser(dto);

        //}
        // POST api/student

        public HttpResponseMessage Post(UserInformation user)
        {
            udb.InsertUser(user);
            var response = Request.CreateResponse(HttpStatusCode.Created, user);
            string url = Url.Link("DefaultApi", new { user.UserID });
            response.Headers.Location = new Uri(url);
            return response;
        }

        [Route("api/deleteuser/{UserID}")]
        public HttpResponseMessage Delete(int UserID)
        {
            udb.DeleteUser(UserID);
            var response = Request.CreateResponse(HttpStatusCode.OK, UserID);
            return response;
        }

        [Route("api/updateuser/{UserID}")]
    
        public HttpResponseMessage Put(int UserID, UserModel user)
        {
            string Name = user.Name;
            string Address = user.Address;
            string PhoneNumber = user.PhoneNumber;
            udb.UpdateUser(UserID,Name,Address,PhoneNumber);
            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;

        }
        [Route("api/searchuser/{SearchString}")]

        public HttpResponseMessage Put(string SearchString)
        {
            
            udb.SearchUser(SearchString);
            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;

        }



    }
}
