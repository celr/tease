using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Tease_Server.Models;
using Ionic.Zip;

namespace Tease_Server.Controllers
{
    public class ProjectController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Project/

        [Authorize]
        public ActionResult Index()
        {
            try
            {
                UserProfile user = getUser();
                var projects = from p in db.Projects
                               where p.UserID == user.UserId
                               select p;
                return View(projects.ToList());
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Project/Details/5
        [Authorize]
        public ActionResult Details(int id = 0)
        {
            try
            {
                UserProfile user = getUser();
                Project project = db.Projects.Find(id);
                if (project == null || project.UserID != user.UserId)
                {
                    return HttpNotFound();
                }
                return View(project);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Project/Create
        [Authorize]
        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Project/Create
        [Authorize]
        [HttpPost]
        public ActionResult Create(Project project)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (db.Projects.Where(x => x.Name == project.Name).Count() > 0)
                    {
                        ViewBag.DuplicateErrorMessage = "Ya existe un proyecto con ese nombre. Elige otro por favor.";
                        return View(project);
                    }
                    project.ModificationDate = DateTime.Now;
                    project.CreationDate = DateTime.Now;
                    project.UserID = getUser().UserId;
                    db.Projects.Add(project);
                    db.SaveChanges();
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/PagesFiles/" + project.ProjectID + "/res/"));
                    return RedirectToAction("Index");
                }

                return View(project);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Project/Edit/5
        [Authorize]
        public ActionResult Edit(int id = 0)
        {
            try
            {
                Project project = db.Projects.Find(id);
                if (project == null || project.User.UserName != User.Identity.Name)
                {
                    return HttpNotFound();
                }
                return View(project);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // POST: /Project/Edit/5
        [Authorize]
        [HttpPost]
        public ActionResult Edit(Project project)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Project p = db.Projects.Find(project.ProjectID);
                    if (p.UserID == getUser().UserId)
                    {
                        db.Projects.Attach(p);
                        p.Name = project.Name;
                        db.SaveChanges();
                    }
                    return RedirectToAction("Index");
                }
                return View(project);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Project/Delete/5
        [Authorize]
        public ActionResult Delete(int id = 0)
        {
            try
            {
                Project project = db.Projects.Find(id);
                UserProfile user = getUser();
                if (project == null || user.UserId != project.UserID)
                {
                    return HttpNotFound();
                }
                return View(project);
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // POST: /Project/Delete/5
        [Authorize]
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            try
            {
                Project project = db.Projects.Find(id);
                if (project.UserID == getUser().UserId)
                {
                    db.Projects.Remove(project);
                    db.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch (Exception e)
            {
                Redirect("/");
                return View();
            }
        }

        //
        // GET: /Project/Zip/projectID

        [Authorize]
        public ActionResult Zip(int projectID)
        {
            string directoryPath = Server.MapPath("/PagesFiles/" + projectID + "/");
            using (ZipFile file = new ZipFile())
            {
                Project project = db.Projects.Find(projectID);
                var pages = from p in db.Pages
                             where p.ProjectID == projectID
                             select p;

                foreach (Page p in pages.ToList())
                {
                    if (System.IO.File.Exists(directoryPath + p.PageID + "/page.zip"))
                    {
                        System.IO.File.Delete(directoryPath + p.PageID + "/page.zip");
                    }
                    file.AddDirectory(directoryPath + p.PageID, project.Name + "/" + p.Name); 
                }
                file.AddDirectory(directoryPath + "res", project.Name + "/res");
                file.Save(directoryPath + "project.zip");
            }
            return base.File(directoryPath + "project.zip", "application/zip");
        }
        
        private UserProfile getUser()
        {
            var user = from s in db.UserProfiles
                       where String.Equals(s.UserName, User.Identity.Name)
                       select s;
            return user.ToList()[0];
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}