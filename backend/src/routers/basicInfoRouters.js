const express = require("express");
const { createSchool, updateDescriptionOfSchool, getAllSchoolNames, getSchoolData, getAllSchoolData } = require("../controller/schoolControllers/schoolController");
const { createDepartment, updateDescriptionOfDepartment, getAllDepartmentNames, getAllDepartmentData, getDepartmentData } = require("../controller/schoolControllers/departmentController");
const { createProgram, updateProgramDescription, getAllProgramData, getAllProgramNames } = require("../controller/schoolControllers/programController");
const { createSubject } = require("../controller/acdemicControllers/subjectController");
const { createSession, getAllSessionData, addSchool, updateSessionName, getSessionNames, getSessionDataByID, getSessionDataByName } = require("../controller/acdemicControllers/sessionController");


const router = express.Router();

router.route("/session").post(createSession).get(getAllSessionData).put(updateSessionName);
router.route("/session/getSessionNames").get(getSessionNames);
router.route("/session/getSessionById/:id").get(getSessionDataByID);
router.route("/session/getSessionByName/:name").get(getSessionDataByName);
router.route("/session/addSchool").put(addSchool);



router.route("/school").post(createSchool).put(updateDescriptionOfSchool).get(getAllSchoolData);
router.route("/school/getSchoolNames").get(getAllSchoolNames);
router.route("/school/:id").get(getSchoolData);



router.route("/department").post(createDepartment).put(updateDescriptionOfDepartment).get(getAllDepartmentData);
router.route("/department/getDepartmentNames/:schoolName").get(getAllDepartmentNames);
router.route("/department/:id").get(getDepartmentData);


router.route("/program").post(createProgram).put(updateProgramDescription).get(getAllProgramData);
router.route("/program/getProgramNames").get(getAllProgramNames);
router.route("/program/:id").get(getAllProgramData);


router.route("/subject").post(createSubject);

module.exports = router;
