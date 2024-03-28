using Microsoft.Ajax.Utilities;
using perfumeApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;
using System.Web.Mvc;

namespace perfumeApp.Controllers
{
    public class ParkingUnitsController : Controller
    {
        public ParkingAppEntities db = new ParkingAppEntities();

        // GET: ParkingUnits
        public ActionResult Index()
        {
            var list = db.ParkingUnits.ToList();
            return View(list);
        }

        public ActionResult Create() 
        {

           
            var list = new SelectList(db.ParkingSpaces, "ParkingSpace_Name", "ParkingSpace_Name");
            ViewBag.spaces = list;
            return View();
        }
        [HttpPost]
        public ActionResult Create([Bind(Include ="ParkingSpace_Name")] ParkingUnit model)
        {
            if(model != null)
            {
                if (ModelState.IsValid)
                {
                    if(model.ParkingSpace_Name == null) return View(model);
                    db.ParkingUnits.Add(model);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            return View();
        }

        public ActionResult Edit(string id)
        {
            if(id != null)
            {
                var res = db.ParkingUnits.Find(id);
                if(res != null)
                {
                    return View(res);
                }
                return View();
            }
            return View();
        }

        [HttpPost]
        public ActionResult Edit(ParkingUnit model)
        {
            if(model != null)
            {
                if (ModelState.IsValid)
                {
                    db.Entry(model).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            return View();
        }
        public ActionResult Delete(string id)
        {
            if(id != null)
            {
                if(ModelState.IsValid)
                {
                   var res = db.ParkingUnits.Find(id);
                    if(res != null)
                    {
                        db.ParkingUnits.Remove(res);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                    
                }
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public ActionResult Delete()
        {
            return View();
        }
    }
}