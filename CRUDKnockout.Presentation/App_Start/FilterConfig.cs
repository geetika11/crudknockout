using System.Web;
using System.Web.Mvc;

namespace CRUDKnockout.Presentation
{
    public class FilterConfig
    {
        //This is used to create and register global MVC filter error filter,action filter etc.
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
