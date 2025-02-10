import { Router } from "express";
import { registerCourse, getCourses, getCourseById, updateCourse, deleteCourse, registeredCourse, getStudentCourses } from "./course.controller.js";
const router = Router();

router.post("/",  registerCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/register",  registeredCourse);
router.get("/student/:id/courses", getStudentCourses);

export default router;
