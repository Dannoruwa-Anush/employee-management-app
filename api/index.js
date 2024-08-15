//creating a web server

const express = require('express'); //Import express package

//body-parse: used to extract information from an incoming HTTP request
const bodyParser = require('body-parser'); //Import body-parser package

const mongoose = require('mongoose'); //Import mongoose package

const moment = require('moment');

const app = express(); //Initialize an app

//constant declaration
const port = 3000;

//cors: Cross-Origin Resource Sharing
const cors = require('cors'); //Import mongoose package

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //To access request body

mongoose.connect("mongodb+srv://anushkadannoruwa:Rk53mP4aEDAe3EXP@cluster0.szwc3s0.mongodb.net/")
    .then(() => {
        console.log("Connect to MongoDb");
    }).catch((error) => {
        console.log("Unable to connect to MongoDb due to", error);
    });

app.listen(port, () => {
    console.log('App is running on port ' + port);
})


//------- [Start - API End Points] --------------
const EmployeeModel = require("./models/employee");
const AttendanceMode = require("./models/attendance");

//save an employee
app.post("/saveEmployee", async (req, res) => {
    try {
        const { employeeNo, name, nic, dateOfBirth, phoneNo, address, designation, joiningDate, salary, active } = req.body;
        //create a new employee 
        const newEmployee = new EmployeeModel({
            employeeNo, name, nic, dateOfBirth, phoneNo, address, designation, joiningDate, salary, active
        });
        await newEmployee.save();
        res.status(201).json({ message: "Employee is saved successfully", employee: newEmployee });
    } catch (error) {
        console.log(error + " is occoured while saving employee");
        res.status(500).json({ message: "Error is occoured while saving employee" });
    }
});

//get all employee
app.get("/getAllEmployees", async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error is occoured while retrieving employee" });
    }
});

//save attendance
app.post("/saveAttendance", async (req, res) => {
    try {
        const { employeeNo, name, date, status } = req.body;

        //find existing attendance of an employee by id and date
        const existingAttendance = AttendanceMode.findOne({ employeeNo, date });

        if (existingAttendance) {
            existingAttendance.status = status;
            await existingAttendance.save();
            res.status(200).json(existingAttendance);
        }
        else {
            const newAttendance = new AttendanceMode({
                employeeNo,
                employeeName,
                date,
                status,
            });
            await newAttendance.save();
            res.status(200).json(newAttendance);
        }
    } catch (error) {
        res.status(500).json({ message: "Error is occoured while saving attendance" });
    }
});


//get all attendance by date
app.get("/getAllAttendanceByDate", async (req, res) => {
    try {
        const {date} = req.query;
        const attendanceForDate = await AttendanceMode.find({date: date});
        res.status(200).json(attendanceForDate);

    } catch (error) {
        res.status(500).json({ message: "Error is occoured while retrieving attendance for the date" });
    }
});


//get all attendance by year month
app.get("/getAllAttendanceByYearMonth", async (req, res) => {
    try {
        const {month, year} = req.query;

        const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf("month").toDate();
        const endDate = moment(startDate).endOf("month").toDate();

        const attendanceReport = await AttendanceMode.aggregate([
            {
                $match:{
                    $expr: {
                        $and:[
                            {
                                $eqn:[
                                    {
                                        $month:{$dateFromString: {dateString: "$date"}},
                                    },
                                    parseInt(req.query.month),
                                ],
                            },
                            {
                                $eqn:[
                                    {
                                        $year:{$dateFromString: {dateString: "$date"}},
                                    },
                                    parseInt(req.query.year),
                                ],
                            },
                        ],
                    },
                },
            },

            {
                $group: {
                    _id:"$employeeNo",
                    present:{
                        $sum:{
                            $cond:{if: {$eqn:["$status","present"]}, then: 1, else: 0},
                        }
                    },
                    absent:{
                        $sum:{
                            $cond:{if: {$eqn:["$status","absent"]}, then: 1, else: 0},
                        }
                    },
                    halfday:{
                        $sum:{
                            $cond:{if: {$eqn:["$status","halfday"]}, then: 1, else: 0},
                        }
                    },
                    holiday:{
                        $sum:{
                            $cond:{if: {$eqn:["$status","holiday"]}, then: 1, else: 0},
                        }
                    }
                }
            },
            {
                $lookup:{
                    from: "employees", //Mongo Db collection name
                    localField: "_id",
                    foreignField: "employeeNo",
                    as: "employeeDetails",
                },
            },
            {
                $unwind: "$employeeDetails",
            },
            {
                $project:{
                    _id: 1,
                    present: 1,
                    absent: 1,
                    halfday: 1,
                    name: "$employeeDetails.name",
                    designation: "$employeeDetails.designation",
                    salary: "$employeeDetails.salary",    
                    employeeNo: "$employeeDetails.employeeNo",    
                }
            },
        ]);

        res.status(200).json(attendanceReport);
    } catch (error) {
        res.status(500).json({ message: "Error is occoured while retrieving attendance by year-month" });
    }
});
//------- [End - API End Points] ----------------