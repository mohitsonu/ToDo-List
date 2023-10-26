//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb+srv://todo:mohitsonu@cluster0.lybkeui.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

// const item1 = new Item({
//   name: "Welcome to todo list amet consectetur adipisicing elit. Ratione magnam ipsam repudiandae alias id cum iste repellat quod quaerat molestias",
// });

// const item2 = new Item({
//   name: "ione magnam ipsam repudiandae alias id cum iste repellat quod quaerat molestias?",
// });

const defaultItem = [];

// Item.insertMany(defaultItem)
//   .then(() => {
//     console.log("Inserted");
//   })
//   .catch((err) => {
//     console.log("Error: " + err);
//   });

app.get("/", function (req, res) {
  // Use the Item model to find all items from the database
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        // Insert the default items if the database is empty
        return Item.insertMany(defaultItem)
          .then(() => {
            console.log("Successfully saved default items to DB.");
          })
          .then(() => {
            return Item.find({}); // Re-fetch items after inserting default items
          });
      }
      return foundItems;
    })
    .then((foundItems) => {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    })
    .catch((err) => {
      console.error(err);
    });
});


app.get("/:customListName", function (req, res) {
const customListNam  =req.params.customListName;
});

// app.post("/", function (req, res) {
//   const itemName = req.body.newItem;
//   const item = new Item({
//     name: itemName,
//   });
//   item.save();

//   res.redirect("/");
// });

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  // Check if the itemName is empty
  if (itemName.trim() === '') {
    // Return the HTML page with JavaScript to display an alert
    return res.send(`
      <script>
        alert("Task cannot be empty");
        window.history.back();
      </script>
    `);
  } else {
    const item = new Item({
      name: itemName,
    });
    item.save();

    res.redirect("/");
  }
});
// ...deletion of the task




app.post("/delete", async function (req, res) {
  const taskId = req.body.delete; // Assuming your button has name="delete" with the task ID as its value

  try {
    // Use findByIdAndDelete to remove the task by ID
    const deletedTask = await Item.findByIdAndDelete(taskId);

    if (deletedTask) {
      console.log("Deleted task with ID: " + taskId);
    } else {
      console.log("Task not found with ID: " + taskId);
    }

    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task: " + err);
    res.status(500).send("Error deleting task.");
  }
});

// ...

 



// app.get("/work", function (req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems,
//   });
// });

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(5000, function () {
  console.log("Server started on port 5000");
});
