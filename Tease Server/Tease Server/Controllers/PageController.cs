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
    public class PageController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Page/

        public ActionResult Index(int ProjectID=-1)
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

        //
        // GET: /Page/Details/5

        public ActionResult Details(int id = 0)
        {
            Page page = db.Pages.Find(id);
            if (page == null || page.Project.UserID != getUser().UserId)
            {
                return HttpNotFound();
            }
            return View(page);
        }

        //
        // GET: /Page/Create

        public ActionResult Create(int projectID)
        {
            if (projectID == -1 || db.Projects.Find(projectID).UserID != getUser().UserId)
            {
                Redirect("/Project");
            }
            ViewBag.ProjectID = projectID.ToString();
            ViewBag.ProjectName = db.Projects.Find(projectID).Name;
            return View();
        }

        //
        // POST: /Page/Create

        [HttpPost]
        public ActionResult Create(Page page)
        {
            if (ModelState.IsValid)
            {
                page.ModificationDate = DateTime.Now;
                page.CreationDate = DateTime.Now;
                db.Pages.Add(page);
                db.SaveChanges();
                return RedirectToAction("Index", new { projectID = page.ProjectID });
            }

            ViewBag.ProjectID = new SelectList(db.Projects, "ProjectID", "Name", page.ProjectID);
            return View(page);
        }

        //
        // GET: /Page/Edit/5

        public ActionResult Edit(int id = 0)
        {
            Page page = db.Pages.Find(id);
            if (page == null || page.Project.UserID != getUser().UserId)
            {
                return HttpNotFound();
            }
            ViewBag.ProjectID = new SelectList(db.Projects, "ProjectID", "Name", page.ProjectID);
            return View(page);
        }

        //
        // POST: /Page/Edit/5

        [HttpPost]
        public ActionResult Edit(Page page)
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

        //
        // GET: /Page/Delete/5

        public ActionResult Delete(int id = 0)
        {
            Page page = db.Pages.Find(id);
            if (page == null || page.Project.UserID != getUser().UserId)
            {
                return HttpNotFound();
            }
            return View(page);
        }

        //
        // POST: /Page/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Page page = db.Pages.Find(id);
            db.Pages.Remove(page);
            db.SaveChanges();
            return RedirectToAction("Index", new { projectID = page.ProjectID });
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