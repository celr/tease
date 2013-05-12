using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Tease_Server.Models;
using System.IO;
using System.IO.Compression;
using Ionic.Zip;

namespace Tease_Server.Controllers
{
    public class PageController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Page/
        [Authorize]
        public ActionResult Index(int ProjectID=-1)
        {
            try
            {

                if (ProjectID == -1)
                {
                    Redirect("/Project");
                }
                var pages = db.Pages.Where(p => p.ProjectID == ProjectID);
                ViewBag.ProjectID = ProjectID;
                ViewBag.ProjectName = db.Projects.Find(ProjectID).Name;
                return View(pages.ToList());
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Page/Details/5
        [Authorize]
        public ActionResult Details(int id = 0)
        {
            try
            {
                Page page = db.Pages.Find(id);
                if (page == null || page.Project.UserID != getUser().UserId)
                {
                    return HttpNotFound();
                }
                return View(page);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Page/Create
        [Authorize]
        public ActionResult Create(int projectID)
        {
            try
            {
                if (projectID == -1 || db.Projects.Find(projectID).UserID != getUser().UserId)
                {
                    Redirect("/Project");
                }
                ViewBag.ProjectID = projectID.ToString();
                ViewBag.ProjectName = db.Projects.Find(projectID).Name;
                return View();
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // POST: /Page/Create
        [Authorize]
        [HttpPost]
        public ActionResult Create(Page page)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (db.Pages.Where(x => x.Name == page.Name && x.ProjectID == page.ProjectID).Count() > 0)
                    {
                        ViewBag.DuplicateErrorMessage = "Ya existe un proyecto con ese nombre. Elige otro por favor.";
                        ViewBag.ProjectId = page.ProjectID.ToString();
                        ViewBag.ProjecTName = db.Projects.Find(page.ProjectID).Name;

                        return View(page);
                    }
                    page.ModificationDate = DateTime.Now;
                    page.CreationDate = DateTime.Now;
                    db.Pages.Add(page);
                    db.SaveChanges();
                    createFiles(page.PageID, page.ProjectID);
                    return RedirectToAction("Index", new { projectID = page.ProjectID });
                }

                ViewBag.ProjectID = new SelectList(db.Projects, "ProjectID", "Name", page.ProjectID);
                return View(page);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Page/Edit/5
        [Authorize]
        public ActionResult Edit(int id = 0)
        {
            try
            {
                Page page = db.Pages.Find(id);
                if (page == null || page.Project.UserID != getUser().UserId)
                {
                    return HttpNotFound();
                }
                ViewBag.ProjectID = new SelectList(db.Projects, "ProjectID", "Name", page.ProjectID);
                return View(page);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // POST: /Page/Edit/5
        [Authorize]
        [HttpPost]
        public ActionResult Edit(Page page)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Page p = db.Pages.Find(page.PageID);
                    db.Pages.Attach(p);
                    p.Name = page.Name;
                    p.ModificationDate = DateTime.Now;
                    db.SaveChanges();
                    return RedirectToAction("Index", new { projectID = page.ProjectID });
                }
                ViewBag.ProjectID = new SelectList(db.Projects, "ProjectID", "Name", page.ProjectID);
                return View(page);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Page/Delete/5
        [Authorize]
        public ActionResult Delete(int id = 0)
        {
            try
            {
                Page page = db.Pages.Find(id);
                if (page == null || page.Project.UserID != getUser().UserId)
                {
                    return HttpNotFound();
                }
                return View(page);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // POST: /Page/Delete/5
        [Authorize]
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            try
            {
                Page page = db.Pages.Find(id);
                db.Pages.Remove(page);
                db.SaveChanges();
                return RedirectToAction("Index", new { projectID = page.ProjectID });
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // Get /Page/Zip?pageID=1;projectID=1
        public ActionResult Zip(int projectID, int pageID)
        {
            Page page = db.Pages.Find(pageID);
            string directoryPath = Server.MapPath("/PagesFiles/" + projectID.ToString() + "/");
            using (ZipFile file = new ZipFile())
            {
                file.AddDirectory(directoryPath + "res/", page.Project.Name + "/res/");
                directoryPath = directoryPath + pageID.ToString() + "/";
                if (System.IO.File.Exists(directoryPath + "page.zip"))
                {
                    System.IO.File.Delete(directoryPath + "page.zip");
                }
                file.AddDirectory(directoryPath, page.Project.Name + "/" + page.Name + "/");
                file.Save(directoryPath + "page.zip");
            }
            return base.File(directoryPath + "page.zip", "application/zip");
        }

        private UserProfile getUser()
        {
            var user = from s in db.UserProfiles
                       where String.Equals(s.UserName, User.Identity.Name)
                       select s;
            return user.ToList()[0];
        }

        private void createFiles(int pageID, int projectID)
        {
            string path = Server.MapPath("~/PagesFiles/" + projectID.ToString() + "/" + pageID.ToString() + "/");
            if(Directory.Exists(path) == false)
            {
                Directory.CreateDirectory(path);
            }

            if (Directory.Exists(Server.MapPath("/EnvironmentFiles/" + pageID.ToString() + "/")) == false)
            {
                Directory.CreateDirectory(Server.MapPath("/EnvironmentFiles/" + pageID.ToString() + "/"));
            }
            FileStream file;
            file = System.IO.File.Create(path + "page1.html");
            file.Close();
            file = System.IO.File.Create(path + "page1-styles.css");
            file.Close();
            file = System.IO.File.Create(path + "page1-animations.css");
            file.Close();
            file = System.IO.File.Create(path + "page1.js");
            file.Close();
            file = System.IO.File.Create(Server.MapPath("~/EnvironmentFiles/" + pageID.ToString() + "/environment.txt"));
            file.Close();
        }


        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}