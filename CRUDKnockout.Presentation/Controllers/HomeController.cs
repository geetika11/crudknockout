using CRUDKnockout.DAL;
using CRUDKnockout.DAL.DBContext;
using CRUDKnockout.Presentation.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRUDKnockout.Presentation.Controllers
{
    public class HomeController : Controller
    {
        UserDBContext userd = new UserDBContext();
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        public ActionResult _RegisterUser(EditUser eu)
        {
            UserDetail user = userd.getUser(eu.ID);
            return PartialView("_RegisterUser",user);
        }
    }
}
