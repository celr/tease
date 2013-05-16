using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Tease_Server.Models;

namespace Tease_Server.Controllers
{
    public class MainController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Tease?pageID=1
        public ActionResult Index(int pageID)
        {
            Page p = db.Pages.Find(pageID);
            ViewBag.pageID = pageID.ToString();
            ViewBag.pageName = p.Name;
            ViewBag.projectID = p.ProjectID;
            return View();
        }

    }
}
