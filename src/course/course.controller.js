import Course from "./course.model.js";
import User from "../user/user.model.js";

export const registerCourse = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { name, description } = req.body;
    const professorId = req.user.id;
    const professor = await User.findById(professorId);

    if (!professor || professor.role !== "TEACHER_ROLE") {
      return res.status(403).json({ message: "Solo los profesores pueden crear los cursos" });
    }

    const newCourse = new Course({ name, description, teacher: professorId });
    await newCourse.save();
    professor.courses.push(newCourse._id);
    await professor.save();

    return res.status(201).json({ message: "Curso creado", course: newCourse });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("teacher", "name surname");
    return res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .populate("teacher", "name surname")
      .populate("students", "name surname");

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const professorId = req.user.id;
    const course = await Course.findById(id);

    if (!course || !course.teacher || course.teacher.toString() !== professorId) {
      return res.status(403).json({ message: "No autorizado o curso no encontrado" });
    }

    course.name = name || course.name;
    course.description = description || course.description;
    await course.save();

    return res.status(200).json({ message: "Curso actualizado exitosamente", course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professorId = req.user.id;
    const course = await Course.findById(id);

    if (!course || !course.teacher || course.teacher.toString() !== professorId) {
      return res.status(403).json({ message: "No autorizado o curso no encontrado" });
    }

    await User.updateMany({ courses: id }, { $pull: { courses: id } });
    await Course.findByIdAndDelete(id);

    return res.status(200).json({ message: "Curso eliminado" });
  } catch (error) {
    next(error);
  }
};

export const registeredCourse = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;
    const student = await User.findById(studentId);

    if (!student || student.role !== "STUDENT_ROLE") {
      return res.status(403).json({ message: "Solo los estudiantes pueden inscribirse" });
    }

    if (student.courses.length >= 3) {
      return res.status(400).json({ message: "Solo puedes inscribirte a 3 cursos" });
    }

    if (student.courses.some(course => course.toString() === courseId)) {
      return res.status(400).json({ message: "Ya estás inscrito en este curso" });
    }

    student.courses.push(courseId);
    await student.save();

    return res.status(200).json({ message: "Curso inscrito", student });
  } catch (error) {
    next(error);
  }
};

export const getStudentCourses = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId).populate("courses", "name description");

    if (!student || student.role !== "STUDENT_ROLE") {
      return res.status(403).json({ message: "Solo los estudiantes pueden ver los cursos" });
    }

    return res.status(200).json(student.courses);
  } catch (error) {
    next(error);
  }
};
