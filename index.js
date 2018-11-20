const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb://localhost/playground",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to mongDB..."))
  .catch(err => console.error("Could not connect to DB ", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model("Course", courseSchema);
async function createCourse() {
  const course = new Course({
    name: "Mastering React Course",
    author: "Mosh Hamedani",
    tags: ["react", "frontend"],
    isPublished: true
  });

  const result = await course.save();
  console.log(result);
}
const pageNumber = 1;
const pageSize = 10;

async function getCourses() {
  const courses = await Course.find({ author: /.*mosh.*/i, isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageNumber)
    .sort({ name: 1 });
  // .select({ name: 1, tags: 1 });
  console.log(courses);
}
getCourses();
