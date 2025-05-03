const express = require("express");
const { createSession, getSessionNames, getSessionDataByName, updateSessionName, updateSessionData, deleteSchoolsFromSession, getAllSessionData } = require("../controller/acdemicControllers/sessionController");
const { getAllDepartmentOfSchool, updateSchoolDepartments } = require("../controller/schoolControllers/schoolController");
const { updateDepartmentPrograms } = require("../controller/schoolControllers/departmentController");
const { updateProgramSpecialization } = require("../controller/schoolControllers/programController");


const router = express.Router();

router.route("/session").post(createSession).put(updateSessionData);
router.route("/session/getSessionNames").get(getSessionNames);
router.route("/session/getSessionByName/:name").get(getSessionDataByName);
router.route("/session/getSessionsData").get(getAllSessionData)



// router.route("/school").put(updateDescriptionOfSchool).get(getAllSchoolData);
// router.route("/school/getSchoolNames").get(getAllSchoolNames);
// router.route("/school/:id").get(getSchoolData);
router.route("/school/getAllDepartment/:schoolInfo").get(getAllDepartmentOfSchool);
router.route("/school/updateSchoolDepartments").put(updateSchoolDepartments);



// router.route("/department").post(createDepartment).put(updateDescriptionOfDepartment).get(getAllDepartmentData);
// router.route("/department/getDepartmentNames/:schoolName").get();
// router.route("/department/:id").get(getDepartmentData);
router.route("/department/updatePrograms").put(updateDepartmentPrograms)


// router.route("/program").post(createProgram).put(updateProgramDescription).get(getAllProgramData);
// router.route("/program/getProgramNames").get(getAllProgramNames);
// router.route("/program/:id").get(getAllProgramData);
router.route("/program/updateSpecialization").put(updateProgramSpecialization)

// router.route("/subject").post(createSubject);

module.exports = router;
