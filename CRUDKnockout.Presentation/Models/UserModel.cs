﻿    using System;
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
        [RegularExpression(@"\^[0-9]{4,20}$", ErrorMessage = "Please enter a valid Mobile Number")]
        public int PhoneNumber { get; set; }
        [Required]
        public int Age { get; set; }
    }
}