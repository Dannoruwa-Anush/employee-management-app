//creating a web server

const express = require('express'); //Import express package

//body-parse: used to extract information from an incoming HTTP request
const bodyParser = require('body-parser'); //Import body-parser package

const mongoose = require('mongoose'); //Import mongoose package

const Decimal = require('mongodb').Decimal128;

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
const AttendanceModel = require("./models/attendance");
const PaySheetModel = require("./models/paySheet")

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
        const existingAttendance = await AttendanceModel.findOne({ employeeNo, date });

        if (existingAttendance) {
            existingAttendance.status = status;
            await existingAttendance.save();
            res.status(200).json(existingAttendance);
        }
        else {
            const newAttendance = new AttendanceModel({
                employeeNo,
                name,
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
        const { date } = req.query;
        const attendanceForDate = await AttendanceModel.find({ date: date });
        res.status(200).json(attendanceForDate);

    } catch (error) {
        res.status(500).json({ message: "Error is occoured while retrieving attendance for the date" });
    }
});

app.get('/getAllAttendanceByYearMonth', async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).send('Year and month must be numeric and are required');
        }

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).send('Month must be between 1 and 12');
        }

        const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        const endDate = new Date(Date.UTC(yearNum, monthNum, 1));

        const query = {
            date: { $gte: startDate, $lt: endDate }
        };

        const attendanceRecords = await AttendanceModel.find(query);

        res.json(attendanceRecords);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//calculate salary for month
app.post('/calculateSalaryForYearMonth', async (req, res) => {
    const { employeeNo, year, month } = req.body;

    try {
        if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).send('Year and month must be numeric and are required');
        }

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).send('Month must be between 1 and 12');
        }

        // Find salary record
        let paySheetRecord = await Salary.findOne({
            employeeNo,
            year: yearNum,
            month: monthNum
        });

        //if paySheet record does not exist, then calculate salary
        if (!paySheetRecord) {
            // Find employee details
            const employee = await EmployeeModel.findOne({ employeeNo });
            if (!employee) {
                return res.status(404).send('Employee not found')
            };

            // Get number of attendances with status "present"
            const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
            const endDate = new Date(Date.UTC(yearNum, monthNum, 1));

            const attendancePresentCount = await AttendanceModel.countDocuments({
                employeeNo,
                status: 'present',
                date: { $gte: startDate, $lt: endDate }
            });

            // Calculate salary
            const monthlySalary = employee.salary * attendancePresentCount;
            const decimalSalary = Decimal.fromString(monthlySalary.toFixed(2));

            // Save calculated salary to PaySheet schema
            const newPaySheet = new PaySheetModel({
                employeeNo,
                employeeName: employee.name,
                year,
                month,
                salary: decimalSalary
            });

            await newPaySheet.save();

            res.status(200).send('Pay sheet generated successfully');
        }
        else{
            return res.status(400).send('The paysheet has already been created'); 
        }
    } catch (error) {
        res.status(500).send('Error occur while generating pay sheet');
    }
});

//get all pay sheet for year month
app.get('/getAllPaySheetsByYearMonth', async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).send('Year and month must be numeric and are required');
        }

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).send('Month must be between 1 and 12');
        }

        const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        const endDate = new Date(Date.UTC(yearNum, monthNum, 1));

        const query = {
            date: { $gte: startDate, $lt: endDate }
        };

        const paySheetRecords = await AttendanceModel.find(query);

        res.json(paySheetRecords);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//------- [End - API End Points] ----------------