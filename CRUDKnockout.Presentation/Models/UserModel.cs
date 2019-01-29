    using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRUDKnockout.Presentation.Models
{
    public class UserModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        
        public int PhoneNumber { get; set; }
        [Required]
        public string Age { get; set; }
        public int ID { get; set; }
        public string Gender { get; set; }
    }
}