import { Router } from "express";
import { registeredCourse, getStudentCourses, updateStudentProfile, deleteStudentProfile, registerCourseProfessor, updateCourseProfessor, deleteCourseProfessor } from "./user.controller.js";

const router = Router();

router.post("/student/registerCourse",  registeredCourse);
router.get("/student/:studentId/courses",  getStudentCourses);
router.patch("/student/:uid/updateProfile",  updateStudentProfile);
router.delete("/student/:uid/deleteProfile",  deleteStudentProfile);

router.post("/teacher/registerCourse",  registerCourseProfessor);
router.patch("/teacher/:id/updateCourse",  updateCourseProfessor);
router.delete("/teacher/:id/deleteCourse", deleteCourseProfessor);

export default router;
