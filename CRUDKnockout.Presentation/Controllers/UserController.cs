using CRUDKnockout.Business.BusinessObject;
using CRUDKnockout.DAL;
using CRUDKnockout.DAL.DBContext;
using CRUDKnockout.Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

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


    }
}
