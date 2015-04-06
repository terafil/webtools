using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace WebTools.Controllers
{
    public class TreeController : ApiController
    {
        [Route("api/v1/tree/leafs")]
        [HttpGet]
        [ResponseType(typeof(IEnumerable<Leaf>))]
        public IHttpActionResult GetLeafs()
        {
            List<Leaf> leafs = new List<Leaf>
            {
                new Leaf { title = "This is a child leaf from the server"},
                new Leaf { title = "This is a child leaf from the server",
                    children = new List<Leaf>
                    {
                        new Leaf { title = "This is a child leaf from the server"}
                    }
                }
            };
            System.Threading.Thread.Sleep(1000);
            return Ok(leafs);
        }
    }

    public class Leaf
    {
        public string title { get; set; }
        public IEnumerable<Leaf> children { get; set; }
    }
}