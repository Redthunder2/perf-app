using Microsoft.Ajax.Utilities;
using perfumeApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace perfumeApp.Controllers
{
    public class TicketsController : Controller
    {
        ParkingAppEntities db = new ParkingAppEntities();
        // GET: Tickets
        public ActionResult Index()
        {
            var TicketsList = db.Tickets.ToList();   
            return View(TicketsList);
        }

        public ActionResult Create() 
        {
            var list = new SelectList(db.ParkingUnits, "Unit_Number", "Unit_Number");
            ViewBag.Units = list;
            return View();
        }
        [HttpPost]
        public ActionResult Create(Ticket model)
        {
            var tic = model;
            return View();
        }

        public ActionResult TicketType()
        {
            return View();
        }
        public ActionResult shortTicketCreate()
        {
            return View();
        }
        [HttpPost]
        public ActionResult shortTicketCreate(Ticket model)
        {
            var mo = model;
            if( mo.User.Length >= 0)
            {
                if(Convert.ToString(mo.Unit_Number).Length >= 0)
                {
                    db.Tickets.Add(mo);
                    db.SaveChanges();
                }
            }
            return View();
        }

        public ActionResult longTicket()
        {
            return View();
        }
    }
}