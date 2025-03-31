const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const { video } = req.files.videoFile;
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      {
        new: true,
      }
    );

    // Log updated section here, after adding populate query

    return res.status(200).json({
      success: true,
      message: "Sub section created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the sub section",
      updatedSection,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    // get data from request
    const { subSectionId, title, timeDuration, description } = req.body;
    const { video } = req.files.videoFile;
    // validate the input
    if (!subSectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // make a DB call to find if particular subsection exists or not
    const subSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        title: title,
        timeDuration: timeDuration,
        description: description,
        video: uploadDetails.secure_url,
      },
      {
        new: true,
      }
    );
    // update
    return res.status(200).json({
      success: true,
      message: "Sub Section updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the sub section",
      error: error.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.params;
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subsection Id needed to delete the subsection",
      });
    }

    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "Sub section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the sub section",
      error: error.message,
    });
  }
};
