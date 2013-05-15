using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Tease_Server.Models;

namespace Tease_Server.Controllers
{
    public class ResourceController : Controller
    {
        private UsersContext db = new UsersContext();

        public ActionResult UploadView(int pageID)
        {
            ViewBag.pageID = pageID;
            return View();
        }

        //
        // POST: /Resource?pageID=
        [HttpPost]
        public ActionResult Upload(int pageID)
        {
            int projectID = db.Pages.Find(pageID).ProjectID;
            
            //Save resource to disk
            HttpPostedFileBase file = Request.Files[0];
            string fileName = System.IO.Path.GetFileNameWithoutExtension(Request.Files[0].FileName);
            string extension = System.IO.Path.GetExtension(Request.Files[0].FileName);
            string directoryPath = Server.MapPath("~/PagesFiles/" + projectID + "/res/");

            if (System.IO.Directory.Exists(directoryPath) == false)
            {
                System.IO.Directory.CreateDirectory(directoryPath);
            }
            int counter = 1;
            string tempFileName = fileName;
            while(System.IO.File.Exists(directoryPath+fileName+extension) == true)
            {
                fileName = tempFileName + "(" + counter.ToString() + ")";
                counter = counter + 1;
            }
            
            file.SaveAs(directoryPath + fileName + extension);

            //Save resource information to db
            Resource res = new Resource();
            res.ProjectID = projectID;
            res.PageID = pageID;
            res.Name = fileName;
            res.Type = extension;
            res.Url = "http://" + Request.Url.Authority + "/PagesFiles/" + projectID + "/res/" + fileName + extension;
            db.Resources.Add(res);
            db.SaveChanges();
            return View();
        }
    }
}
