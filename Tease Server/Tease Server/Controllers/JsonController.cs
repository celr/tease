using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Tease_Server.Models;

namespace Tease_Server.Controllers
{
    public class JsonController : Controller
    {
        private UsersContext db = new UsersContext();
        //
        // GET: /Json/
        [Authorize]
        public JsonResult Index()
        {
            try
            {
                SourceFile file = new SourceFile();
                file.code = "printf();";
                file.pageID = 1;
                file.type = "css";
                return Json(file, JsonRequestBehavior.AllowGet);
            }
            catch(Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }
        //
        // GET: /Json/GetCSS?pageID=1
        [Authorize]
        public JsonResult GetCSS(int pageID)
        {
            try
            {
                SourceFile file = readFile(pageID, "css");
                return Json(file, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }


        //
        // GET: /Json/GetHTML?pageID=1
        [Authorize]
        public JsonResult GetHTML(int pageID)
        {
            try
            {
                SourceFile file = readFile(pageID, "html");
                return Json(file, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Json/GetJavaScript?pageID=1
        [Authorize]
        public JsonResult GetJavaScript(int pageID)
        {
            try
            {
                SourceFile file = readFile(pageID, "javascript");
                return Json(file, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }

        // POST: /Json/UpdateCSS/
        [HttpPost]
        public JsonResult UpdateCSSAnimations(SourceFile file)
        {
            try
            {
                string status = updateFile(file, "css", "animations");
                return Json(status, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Json/UpdateCSSStyles/

        [Authorize]
        [HttpPost]
        public JsonResult UpdateCSSStyles(SourceFile file)
        {
            try
            {
                string status = updateFile(file, "css", "styles");
                return Json(status, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Json/UpdateHTML/
        [Authorize]
        [HttpPost]
        public JsonResult UpdateHTML(SourceFile file)
        {
            try
            {
                string status = updateFile(file, "html");
                return Json(status, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Json/UpdateJavaScript/
        [Authorize]
        [HttpPost]
        public JsonResult UpdateJavaScript(SourceFile file)
        {
            try
            {
                string status = updateFile(file, "javascript");
                return Json(status, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json("server error", JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Json/UpdatePage?pageID=1
        [Authorize]
        [HttpPost]
        public JsonResult UpdatePage(){
            string directoryPath = Server.MapPath("~/EnvironmentFiles/" + Request["pageID"] + "/");
            if (System.IO.Directory.Exists(directoryPath) == false)
            {
                System.IO.Directory.CreateDirectory(directoryPath);
            }

            System.IO.StreamReader streamReader = new System.IO.StreamReader(Request.InputStream);
            System.IO.File.WriteAllText(directoryPath + "environment.txt", streamReader.ReadToEnd());
            return Json("success", JsonRequestBehavior.AllowGet);
        }

        //
        // GET: /Json/GetPage?pageID=1
        [Authorize]
        public JsonResult GetPage(int pageID)
        {
            string directoryPath = Server.MapPath("~/EnvironmentFiles/" + pageID.ToString() + "/");
            string environment = System.IO.File.ReadAllText(directoryPath + "environment.txt"); 
            return Json(environment, JsonRequestBehavior.AllowGet);
        }

        // GET: /Json/GetPage?pageID=1

        public JsonResult GetResourcesList(int pageID)
        {
            List<Resource> resources = db.Resources.Where(x => x.PageID == pageID).ToList();
            return Json(resources, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Index(SourceFile file)
        {
            file.code = file.code + " [received]";
            return Json(file, JsonRequestBehavior.AllowGet);
        }

        private SourceFile readFile(int pageID, string type){
            int projectID = db.Pages.Find(pageID).ProjectID;
            SourceFile file = new SourceFile();
            string path = "~/PagesFiles/" + projectID + "/" + pageID.ToString() + "/code.";
            if (type.CompareTo("css") == 0)
            {
                path = Server.MapPath(path + "css");
            }
            else if (type.CompareTo("html") == 0)
            {
                path = Server.MapPath(path + "html");
            }
            else
            {
                path = Server.MapPath(path + "js");
            }
            file.code = System.IO.File.ReadAllText(path);
            file.type = type;
            file.pageID = pageID;
            return file;
        }

        private string updateFile(SourceFile file, string type, string nameSuffix = ""){
            string extension = type;
            int projectID = db.Pages.Find(file.pageID).ProjectID;
            if(extension.CompareTo("javascript") == 0){
                extension = "js";
            }
            string path = "";
            if (string.IsNullOrEmpty(nameSuffix) == false)
            {
                path = Server.MapPath("~/PagesFiles/" + projectID + "/" + file.pageID.ToString() + "/page1" + "-" + nameSuffix + "." + extension);
            }
            else
            {
                path = Server.MapPath("~/PagesFiles/" + projectID + "/" + file.pageID.ToString() + "/page1." + extension);
            }
            System.IO.File.WriteAllText(path, file.code);
            return "success";
        }
    }
}
