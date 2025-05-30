const express = require("express")
const router = express.Router()

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course")

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingAndReview")

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// Category routes (Only by Admin)
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router