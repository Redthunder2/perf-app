using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace perfumeApp.Models
{
    public class comments
    {
        [Key]
        public int comments_id;
        public string commenter_name;
        public string comment_body;
    }

    public class Comments_Context : DbContext
    {
        public Comments_Context() : base("CommentsConnection")
        {
        }

        public virtual DbSet<comments> Comments { get; set; }
    }
}