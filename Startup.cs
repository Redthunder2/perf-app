﻿using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(perfumeApp.Startup))]
namespace perfumeApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
