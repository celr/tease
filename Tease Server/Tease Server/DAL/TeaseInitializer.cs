using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Tease_Server.Models;

namespace Tease_Server.DAL
{
    public class TeaseInitializer : DropCreateDatabaseIfModelChanges<UsersContext>
    {
        protected override void Seed(UsersContext context)
        {

        }
    }
}