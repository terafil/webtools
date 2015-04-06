using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
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

        [Route("api/v1/files")]
        [HttpPost]
        public IHttpActionResult PostFile()
        {
            if(!Request.Content.IsMimeMultipartContent())
            {
                return BadRequest();
            }
            string root = HttpContext.Current.Server.MapPath("~/pending");
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                Request.Content.ReadAsMultipartAsync(provider).Wait();

                /*foreach (MultipartFileData file in provider.FileData)
                {
                    Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                    Trace.WriteLine("Server file path: " + file.LocalFileName);
                }*/

                return Ok();
            }
            catch(Exception e)
            {
                return BadRequest();
            }

            /*var files = HttpContext.Current.Request.Files;

            foreach(HttpPostedFile file in files)
            {
                file.SaveAs(Path.Combine(HttpContext.Current.Server.MapPath("~/pending"), file.FileName));
            }*/

            
        }
    }

    public class Leaf
    {
        public string title { get; set; }
        public IEnumerable<Leaf> children { get; set; }
    }
}