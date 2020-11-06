var bodyParser = require("body-Parser"),
methodOveride  = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express")
app            = express();

mongoose.connect("mongodb://localhost:27017/restfull_blog_app", {useNewUrlParser:true});

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOveride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created:{type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
//  Blog.create(
//      {
//          title:"Tourism",
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          body: "Travelling is the very important to refresh our mind."

//      }
//  )
 app.get("/",function(req, res){
     res.redirect("/blogs")

 })

 app.get("/blogs",function(req, res){
     Blog.find({}, function(err,blogs){
         if(err){
             console.log(err);

         }else{
            res.render("index",{blogs:blogs});
         }
     })
  
 })
 app.get("/blogs/new",function(req, res){
    res.render("new")
})   
 app.post("/blogs", function(req, res){
     Blog.create(req.body.blog, function(err, newBlog){
         if(err){
             res.render("new")
         }else{
             res.redirect("/blogs")
         }
     })
 });

 app.get("/blogs/:id", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
         if(err){
             res.redirect("/blogs")
         }else{
             res.render("show", {blog:foundBlog});
         }
     })
 });
 app.get("/blogs/:id/edit", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
         if(err){
             res.redirect("/blogs")
            }else{
                res.render("edit", {blog:foundBlog})
            }
     })
 });
 app.put("/blogs/:id", function(req, res){
     console.log(req.body);
     req.body.blog.body = req.sanitize(req.body.blog.body);
     console.log("=======");
     console.log(req.body);

Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
        res.redirect("/blogs")
    }else{
        res.redirect("/blogs/"+req.params.id);
    }
})
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("blogs")
        }else{
            res.redirect("/blogs")
        }
    })
});
 app.listen(3565,function(){
    console.log("server started");
});