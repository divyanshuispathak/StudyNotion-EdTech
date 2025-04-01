const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const user = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  try {
    const { course_id } = req.body;
    const userId = req.user.id;
    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course Id",
      });
    }

    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Could not find the course",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "Student already enrolled",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: course_id,
        userId,
      },
    };

    try {
      // initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while capturing the payment",
      error: message.error,
    });
  }
};

// verify signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = "1234567";
    const signature = req.headers("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature == digest) {
      console.log("Payment is authorized");
      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try {
        // find the course and enroll the student to it
        const enrolledCourse = await Course.findOneAndUpdate(
          {
            _id: courseId,
          },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          {
            new: true,
          }
        );

        if (!enrolledCourse) {
          return res.status(400).json({
            success: false,
            message: "Course not found",
          });
        }

        console.log(enrolledCourse);

        // find the student and add the course to their list enrolled
        const enrolledStudent = await user.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $push: {
              courses: courseId,
            },
          },
          {
            new: true,
          }
        );
        console.log(enrolledStudent);

        // send confirmation mail
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "Congratulation from StudyNotion",
          "Congratulation, you are onboarded into new StudyNotion course"
        );

        console.log(emailResponse);
        return res.status(200).json({
          success: true,
          message: "Signature verified and course added",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
          error: error.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
