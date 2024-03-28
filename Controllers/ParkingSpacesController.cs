using perfumeApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace perfumeApp.Controllers
{
    public class ParkingSpacesController : Controller
    {
        public ParkingAppEntities db = new ParkingAppEntities();

        // GET: ParkingSpaces
        public ActionResult Index()
        {
            var p = db.ParkingSpaces;
            return View(p);
        }

        public ActionResult Create() 
        {
            return View();
        }
        [HttpPost]
        public ActionResult Create(ParkingSpace model)
        {
            if (ModelState.IsValid)
            {
                var p = db.ParkingSpaces.Add(model);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.error = "Operation failed, please make sure that you have entered the correct information";
                return View();
            }
        }

        public ActionResult Edit(string id)
        {
            if(id != null)
            {
                var res = db.ParkingSpaces.Find(id);

                if(res != null)
                {
                    return View(res);
                }
            }
            return View();
        }
        [HttpPost]
        public ActionResult Edit(ParkingSpace editModel){
            if(editModel != null)
            {
                if(ModelState.IsValid)
                {
                    db.Entry(editModel).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                return View();
            }
            return View();


        }

        
        public ActionResult Delete(string id)
        {
            if(id != null)
            {
                var res = db.ParkingSpaces.Find(id);
                if(res != null)
                {
                    db.ParkingSpaces.Remove(res);
                    db.SaveChanges();
                  return RedirectToAction("Index");
                }
            }
            return RedirectToAction("Index");
            
        }
    }
}