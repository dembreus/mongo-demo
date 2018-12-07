const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb://localhost/playground",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to mongDB..."))
  .catch(err => console.error("Could not connect to DB ", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150
    //match: \pattern\
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    trim: true
  },
  author: { type: String, required: true },
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          // Do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: "A course should have at least one tag."
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Mastering React Course",
    category: "-",
    author: "Mosh Hamedani",
    tags: [],
    isPublished: true,
    price: 15
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
}
const pageNumber = 1;
const pageSize = 10;

async function getCourses() {
  const courses = await Course.find({ author: /.*mosh.*/i, isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 });
  // .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "The Dude",
        isPublished: true
      }
    },
    { new: true }
  );
  console.log(course);
}

async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

createCourse();
// removeCourse("5c09ee7236d74a8f4c3f3b38");
