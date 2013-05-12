using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tease_Server.Models
{
    public class SourceFile
    {
        public string code {get; set;}
        public int pageID { get; set; }
        public string type { get; set; }
    }
}