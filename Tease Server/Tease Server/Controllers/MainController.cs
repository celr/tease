using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Tease_Server.Controllers
{
    public class MainController : Controller
    {
        //
        // GET: /Tease?pageID=1
        public ActionResult Index(int pageID)
        {
            ViewBag.pageID = pageID.ToString();
            return View();
        }

    }
}
