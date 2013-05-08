using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Tease_Server.Models;

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
            UserProfile user = getUser();
            var projects = from p in db.Projects
                           where p.UserID == user.UserId
                           select p;
            return View(projects.ToList());
        }

        //
        // GET: /Project/Details/5
        [Authorize]
        public ActionResult Details(int id = 0)
        {
            UserProfile user = getUser();
            Project project = db.Projects.Find(id);
            if (project == null || project.UserID != user.UserId)
            {
                return HttpNotFound();
            }
            return View(project);
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
            if (ModelState.IsValid)
            {
                project.ModificationDate = DateTime.Now;
                project.CreationDate = DateTime.Now;
                project.UserID = getUser().UserId;
                db.Projects.Add(project);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(project);
        }

        //
        // GET: /Project/Edit/5
        [Authorize]
        public ActionResult Edit(int id = 0)
        {
            Project project = db.Projects.Find(id);
            if (project == null || project.User.UserName != User.Identity.Name)
            {
                return HttpNotFound();
            }
            return View(project);
        }

        //
        // POST: /Project/Edit/5
        [Authorize]
        [HttpPost]
        public ActionResult Edit(Project project)
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

        //
        // GET: /Project/Delete/5
        [Authorize]
        public ActionResult Delete(int id = 0)
        {
            Project project = db.Projects.Find(id);
            UserProfile user = getUser();
            if (project == null || user.UserId != project.UserID)
            {
                return HttpNotFound();
            }
            return View(project);
        }

        //
        // POST: /Project/Delete/5
        [Authorize]
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Project project = db.Projects.Find(id);
            if (project.UserID == getUser().UserId)
            {
                db.Projects.Remove(project);
                db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        public UserProfile getUser()
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