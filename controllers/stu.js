const Student = require("./../models/stu");

// const addStudent = async (req, res) => {
//   try {
//     const {
//       admissionNo,
//       firstName,
//       lastName,
//       email,
//       phone,
//       dateOfBirth,
//       address,
//       city,
//       state,
//       pincode,
//       guardianName,
//       guardianPhone,
//       courseId,
//       course,
//       status,
//       admissionDate,
//     } = req.body;

//     // Basic validation
//     if (
//       !admissionNo ||
//       !firstName ||
//       !lastName ||
//       !email ||
//       !phone ||
//       !courseId ||
//       !course ||
//       !admissionDate
//     ) {
//       return res.status(400).json({
//         message: "Required fields are missing",
//       });
//     }

//     // Check duplicate admissionNo or email
//     const existingStudent = await Student.findOne({
//       $or: [{ admissionNo }, { email }],
//     });

//     if (existingStudent) {
//       return res.status(409).json({
//         message: "Student already exists",
//       });
//     }

//     const student = await Student.create({
//       admissionNo,
//       firstName,
//       lastName,
//       email,
//       phone,
//       dateOfBirth,
//       address,
//       city,
//       state,
//       pincode,
//       guardianName,
//       guardianPhone,
//       courseId,
//       course,
//       status,
//       admissionDate,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Student added successfully",
//     //   data: student,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// GET Students List

const addStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      guardianName,
      guardianPhone,
      courseId,
      courseName,
    } = req.body;

    // Required validation
    if (!firstName || !lastName || !email || !phone || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Duplicate email check
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already exists",
      });
    }

    // 🔹 Dynamic Admission No
    const year = new Date().getFullYear();
    const lastStudent = await Student.findOne().sort({ createdAt: -1 });

    let nextNumber = "0001";
    if (lastStudent?.admissionNo) {
      const lastNumber = parseInt(lastStudent.admissionNo.slice(-4));
      nextNumber = String(lastNumber + 1).padStart(4, "0");
    }

    const admissionNo = `FS${year}${nextNumber}`;

    const student = await Student.create({
      admissionNo,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      guardianName,
      guardianPhone,
      courseId,
      courseName,
      status: "ACTIVE",           // ✅ dynamic
      admissionDate: new Date(),  // ✅ dynamic
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: {
        id: student._id,
        admissionNo: student.admissionNo,
        status: student.status,
        admissionDate: student.admissionDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      courseId,
    } = req.query;

    const query = {};

    // Status filter (ACTIVE / INACTIVE)
    if (status) {
      query.status = status;
    }

    // Course filter
    if (courseId) {
      query.courseId = courseId;
    }

    // Search (name, email, admissionNo)
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { admissionNo: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Student.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE Student
const updateStudent = async (req, res) => {
  try {
    const { _id } = req.params;

    // Check student exists
    const student = await Student.findById(_id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Prevent duplicate email / admissionNo
    if (req.body.email || req.body.admissionNo) {
      const duplicate = await Student.findOne({
        _id: { $ne: id },
        $or: [
          { email: req.body.email },
          { admissionNo: req.body.admissionNo },
        ],
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Email or Admission No already exists",
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getStudentDatabyId

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (id) {
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    // 1️⃣ Get Student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2️⃣ Get Fee Structure using studentId
    const feeStructure = await feeStructure.findOne({ studentId: id });

    res.status(200).json({
      success: true,
      data: {
        student,
        feeStructure, // 👈 yaha aa gaya
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  getStudentById,
};