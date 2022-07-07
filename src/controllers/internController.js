const internModel = require("../model/internModel");
const collegeModel = require("../model/collegeModel");

const createIntern = async function (req, res) {
  try {
    // intern details is sent through request body
    let data = req.body;

    // if request body is empty
    if (!Object.keys(data).length)
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter The Intern Details" });

    // if intern's name is empty
    if (!data.name)
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter The Intern Name" });
    // if name is invalid
    if (!data.name.match(/^[a-zA-Z. ]{2,30}$/))
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter A valid Intern Name" });

    // if intern's mobile is empty
    if (!data.mobile)
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter The Intern Mobile Number" });
    // if mobile is invalid
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(data.mobile))
      return res.status(400).send({
        status: false,
        msg: `${data.mobile} is not a valid mobile number, Please provide a valid mobile number`,
      });
    // if mobile is not unique, i.e., already present in our database
    let numberCheck = await internModel.findOne({
      mobile: data.mobile,
    });
    if (numberCheck)
      return res
        .status(400)
        .send({ status: false, msg: "Mobile number is already used!" });

    // if intern's email is empty
    if (!data.email)
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter The Intern EmailID" });
    // if email is invalid
    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))
      return res.status(400).send({ status: false, msg: "email is invalid" });
    // if email is not unique, i.e., already present in our database
    let emailCheck = await internModel.findOne({
      email: data.email,
    });
    if (emailCheck)
      return res
        .status(400)
        .send({ status: false, msg: "email is already used!" });

    // if intern's collegeName is empty
    if (!data.collegeName)
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the intern's college name" });

    // isDeleted validation
    if (data.isDeleted == true)
      return res.status(400).send({
        status: false,
        msg: "isDeleted cannot be true While Creating a Document",
      });

    // manipulating collegeName to correct format
    let collegeName = data.collegeName.toLowerCase().trim();

    // college should be present in our database
    let checkCollege = await collegeModel.findOne({
      name: collegeName,
      isDeleted: false,
    });

    // if college is not in our database
    if (!checkCollege)
      //response
      return res.status(400).send({
        status: false,
        message: `${collegeName} : No such college name found!`,
      });

    // if college exists in our database
    let collegeId = checkCollege._id; //getting the collegeId
    data.collegeId = collegeId; //entering the collegeId into data

    const createdIntern = await internModel.create(data); // creating intern in our database
    // response
    return res.status(201).send({
      status: true,
      message: `Successfully applied for internship from ${collegeName}`,
      data: createdIntern,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { createIntern };
