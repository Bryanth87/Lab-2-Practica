import User from "../models/user.model.js";
import Course from "../models/course.model.js";

export const registeredCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const student = await User.findById(studentId);

    if (!student || student.role !== "STUDENT_ROLE") {
      return res.status(403).json({ 
        message: "Solo los estudiantes se pueden inscribir" 
      });
    }

    if (student.courses.length >= 3) {
      return res.status(400).json({ 
        message: 
        "Solo puedes inscribirte a 3 cursos" 
      });
    }

    if (student.courses.includes(courseId)) {
      return res.status(400).json({ 
        message:
        "Ya estás inscrito en este curso" 
      });
    }

    student.courses.push(courseId);
    await student.save();
    return res.status(200).json({
       message: "Curso inscrito", 
       student 
      });
  } catch (errorr) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: errorr.message
    });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId).populate("courses", "name description");

    if (!student || student.role !== "STUDENT_ROLE") {
      return res.status(403).json({ 
        message: 
        "Solo los estudiantes pueden ver los cursos" 
      });
    }

    return res.status(200).json(student.courses);
  } catch (errorr) {
    return res.status(500).json({
      success: false,
      message: "Error en el curso",
      error: errorr.message
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = req.body;
    const student = await User.findByIdAndUpdate(uid, data, { new: true, runValidators: true });
    if (!student || student.role !== "STUDENT_ROLE") {
      return res.status(403).json({ 
        message: 
        "Solo los estudiantes pueden actualizar su perfil" 
      });
    }
    res.status(200).json({
      success: true,
      msg: 'Perfil de estudiante actualizado',
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

export const deleteStudentProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const student = await User.findByIdAndDelete(uid);
    if (!student || student.role !== "STUDENT_ROLE") {
      return res.status(403).json({
         message: "Solo los estudiantes pueden eliminar su perfil" 
      });
    }
    res.status(200).json({
      success: true,
      msg: 'Perfil eliminado',
      data: null,
    });
  } catch (errorr) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar perfil",
      error: errorr.message
    });
  }
};

export const registerCourseProfessor = async (req, res) => {
  try {
    const { name, description, professorId } = req.body;
    const professor = await User.findById(professorId);
    if (!professor || professor.role !== "TEACHER_ROLE") {
      return res.status(403).json({ 
        message: 
        "Solo los profesores pueden crear los cursos" 
      });
    }
    const newCourse = new Course({ name, description, teacher: professorId });
    await newCourse.save();
    professor.courses.push(newCourse._id);
    await professor.save();
    return res.status(201).json({ 
      message: "Curso creado", 
      course: newCourse 
    });
  } catch (errorr) {
    return res.status(500).json({
      success: false,
      message: "Error al crear curso el usuario",
      error: errorr.message
    });
  }
};

export const updateCourseProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const professorId = req.user.id;
    const course = await Course.findById(id);
    if (!course || course.professor.toString() !== professorId) {
      return res.status(403).json({ 
        message: "Curso no encontrado" 
      });
    }
    course.name = name || course.name;
    course.description = description || course.description;
    await course.save();
    return res.status(200).json({ message: 
      "Curso actualizado con éxito", 
      course 
    });
  } catch (errorr) {
    return res.status (500).json({
      success: false,
      message: "Error al actualizar curso",
      error: errorr.message
    });
  }
};

export const deleteCourseProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.user.id;
    const course = await Course.findById(id);
    if (!course || course.teacher.toString() !== professorId) {
      return res.status(403).json({
         message: "No autorizado o curso no encontrado" 
      });
    }
    await User.updateMany({ courses: id }, { $pull: { courses: id }});
    await Course.findByIdAndDelete(id);
    return res.status(200).json({
       message: "Curso eliminado"
      });
  } catch (errorr) {
    return res.status(500).json({
      success: false,
      message: "Error al borrar curso el usuario",
      error: errorr.message
    });
  }
};
