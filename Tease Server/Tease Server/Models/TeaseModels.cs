using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Tease_Server.Models;
using System.ComponentModel.DataAnnotations;

namespace Tease_Server.Models
{
    public class Project
    {
        public int ProjectID { get; set; }
        [Display(Name="Fecha de creación")]
        public DateTime CreationDate { get; set; }
        [Display(Name="Fecha de modificación")]
        public DateTime ModificationDate { get; set; }
        [Required(ErrorMessage="El nombre es requerido.")]
        [Display(Name="Nombre")]
        public string Name { get; set; }
        public int UserID { get; set; }
        public virtual UserProfile User{ get; set; }
        public virtual IEnumerable<Page> Pages { get; set; }
    }

    public class Page
    {
        public int PageID { get; set; }
        [Required(ErrorMessage = "El nombre es requerido")]
        [Display(Name = "Nombre")]
        public string Name { get; set; }
        [Display(Name = "Fecha de creación")]
        public DateTime CreationDate { get; set; }
        [Display(Name = "Fecha de modificación")]
        public DateTime ModificationDate { get; set; }
        public string codePath { get; set; }
        public int ProjectID { get; set; }
        public virtual Project Project { get; set; }
    }
}

