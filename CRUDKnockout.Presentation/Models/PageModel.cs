using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRUDKnockout.Presentation.Models
{
    public class PageModel
    {
        public int ID { get; set; }
        public IEnumerable<UserModel> User { get; set; }
        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
    }
}