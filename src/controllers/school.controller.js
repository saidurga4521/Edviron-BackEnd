import sendResponse from "../utils/response.js";
import School from "../models/school.model.js";

export const getSchools = async (req, res) => {
  try {
    console.log("Fetching schools for user:", req.user.id);

    const schools = await School.find({ user_id: req.user.id });

    if (!schools || schools.length === 0) {
      return sendResponse(res, false, "Schools not found", null, 404);
    }

    sendResponse(res, true, "Schools fetched successfully", schools, 200);
  } catch (error) {
    console.error("Error fetching schools:", error);
    sendResponse(res, false, error.message, null, 500);
  }
};
