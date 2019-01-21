using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRUDKnockout.Shared.DTO
{
    public class GetAllUsersDTO
    {

        public int UserID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int PhoneNumber { get; set; }
        public string Age { get; set; }
        public string Gender { get; set; }


    }
}
