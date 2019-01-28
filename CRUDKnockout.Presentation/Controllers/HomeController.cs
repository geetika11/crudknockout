using AutoMapper;
using CRUDKnockout.DAL;
using CRUDKnockout.DAL.DBContext;
using CRUDKnockout.Presentation.Models;
using CRUDKnockout.Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRUDKnockout.Presentation.Controllers
{
    public class HomeController : Controller
    {
        IMapper userMapper,pageMapper;
        UserDBContext userDbContext = new UserDBContext();
        public HomeController()
        {
            var conf = new MapperConfiguration(cfg =>
              {
                  cfg.CreateMap<UserPaginationDTO, UserPaginationModel>();
              });
            userMapper = new Mapper(conf);
            var conf1 = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<UserPaginationDTO, UserPaginationModel>();
            });
            pageMapper = new Mapper(conf1);
        }

        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            return View();
        }
        public ActionResult _RegisterUser(UserModel eu)
        {
            UserDetail user = userDbContext.getUser(eu.ID);
            UserModel userModel = new UserModel();
            userModel.Address = user.Address;
            userModel.Age = user.Age;
            userModel.Gender = user.Gender;
            userModel.Name = user.Name;
            userModel.PhoneNumber = user.PhoneNumber;
            return PartialView("_RegisterUser",userModel);
        }
        [HttpPost]
        public JsonResult _GridTest(UserPaginationModel userModel)
        {
            if (userModel.ID == 0)
            {
                userModel.ID = 1;
            }
            var dto1 = userDbContext.getTenUser(userModel.ID);
            userModel = pageMapper.Map<UserPaginationDTO, UserPaginationModel>(dto1);            
            return Json(userModel, JsonRequestBehavior.AllowGet);
        }
    }
}
