const collegeModel = require("../model/collegeModel");
const internModel = require("../model/internModel");

//------------------------------------------------------------------------------------------------------------------------------------------------------

const createCollege = async function (req, res) {
  try {
    // college details sent through request body
    let data = req.body;

    // if request body is empty
    if (!Object.keys(data).length)
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter The College Details!" });

    // is college's name(shortened form) is empty
    if (!data.name)
      return res.status(400).send({
        status: false,
        msg: "Please enter the college name(shortened form)",
      });
    const name = data.name.toLowerCase().split(" ").join(""); //manipulating college's name to correct format
    data.name = name; //reassigning the name in data Object
    // if name is not unique; already present in our database
    let checkCollegeName = await collegeModel.findOne({
      name: name,
    });
    if (checkCollegeName)
      return res
        .status(400)
        .send({ status: false, msg: "College name is already used!" });

    // if college's FullName is empty
    if (!data.fullName)
      return res
        .status(400)
        .send({ status: false, msg: "Enter the FullName of the College" });

    // if college's logolink is empty
    if (!data.logoLink)
      return res.status(400).send({
        status: false,
        msg: "Please enter the logoLink of the college",
      });
    // if logolink is invalid
    if (
      !/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(
        data.logoLink
      )
    )
      return res.status(400).send({
        status: false,
        msg: `${data.logoLink} is not a valid URL`,
      });
    // if logolink is not unique; already present in our database
    let checkLogo = await collegeModel.findOne({
      logoLink: data.logoLink,
    });
    if (checkLogo)
      return res
        .status(400)
        .send({ status: false, msg: "logoLink is already used!" });

    // isDeleted validation
    if (data.isDeleted == true)
      return res.status(400).send({
        status: false,
        msg: "We can't delete a document while creating it",
      });

    // creating college
    let createdCollege = await collegeModel.create(data);
    //response
    res.status(201).send({
      status: true,
      msg: "College created successfully",
      data: createdCollege,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

const getCollegeDetails = async function (req, res) {
  try {
    // college's name(shortened form) is sent through query params
    let collegeName = req.query.collegeName;

    // if collegeName is not entered
    if (!collegeName) {
      return res.status(404).send({
        status: false,
        message: "Please enter collegeName to proceed!",
      });
    }

    // if college is not found in the database
    let collegeData = await collegeModel
      .findOne({ name: collegeName })
      .select({ _id: 1, name: 1, fullName: 1, logoLink: 1 });
    if (!collegeData) {
      return res
        .status(404)
        .send({ status: false, message: "College not found" });
    }

    // data is manipulated to correct format
    let data = collegeData.toJSON();

    // students from college applying for internship
    let interns = await internModel
      .find({ collegeId: collegeData._id })
      .select({ name: 1, email: 1, mobile: 1 });

    // entering new key-value pair inside data object using dot notation
    data.interns = interns;

    // not required; removing using delete operator
    delete data._id;

    // if no interns from a college
    if (interns.length === 0) {
      return res.status(404).send({
        status: false,
        message: `No students from ${collegeData.fullName} have applied for internship`,
        data: data,
      });
    }

    res.status(200).send({ status: true, data: data });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: err.message });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = { createCollege, getCollegeDetails };
