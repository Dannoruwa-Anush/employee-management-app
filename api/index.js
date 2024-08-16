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
        res.status(500).json({ message: "Error is occoured while retrieving employees" });
    }
});

//get employee by id
app.get("/getEmployeeById/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const employee = await EmployeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error('Error occurred while retrieving employee:', error);
        res.status(500).json({ message: "An error occurred while retrieving the employee" });
    }
});

//update (patch) an employee
app.put("/updateEmployee/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Update the employee document
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id, // Filter
            { $set: updateData }, // Update operation
            { new: true, runValidators: true } // Options: return the updated document and run validators
        );

        // Check if the employee was found and updated
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
    } catch (error) {
        console.error("Error occurred while updating employee:", error);
        res.status(500).json({ message: "Error occurred while updating employee" });
    }
});

//delete employee by id
app.delete("/deleteEmployee/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ID format:", id);
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Create a new ObjectId instance
        const objectId = new mongoose.Types.ObjectId(id);

        // Perform the delete operation
        const result = await EmployeeModel.deleteOne({ _id: objectId });

        // Check if a document was deleted
        if (result.deletedCount === 0) {
            console.log("Employee not found with ID:", id);
            return res.status(404).json({ message: "Employee not found" });
        }
        
        res.status(200).json({ message: "Employee successfully deleted" });
    } catch (error) {
        console.error('Error occurred while deleting employee:', error);
        res.status(500).json({ message: "An internal server error occurred while deleting the employee" });
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

        // Query to find attendance by start date and end date
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

//calculate monthly salary for all employees
app.post('/calculateSalaryForAllByYearMonth', async (req, res) => {
    const { year, month } = req.body;

    try {
        // Validate year and month
        if (year == null || month == null || isNaN(year) || isNaN(month)) {
            return res.status(400).send('Year and month must be numeric and are required');
        }

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).send('Month must be between 1 and 12');
        }

        // Define date range for attendance
        const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        const endDate = new Date(Date.UTC(yearNum, monthNum, 1));

        // Fetch all employees
        const employees = await EmployeeModel.find();

        if (employees.length === 0) {
            return res.status(404).send('No employees found');
        }

        for (const employee of employees) {
            // Check if pay sheet record already exists for this employee
            let paySheetRecord = await PaySheetModel.findOne({
                employeeNo: employee.employeeNo,
                year: yearNum,
                month: monthNum
            });

            if (!paySheetRecord) {
                // Get number of attendances with status "present"
                const attendancePresentCount = await AttendanceModel.countDocuments({
                    employeeNo: employee.employeeNo,
                    status: 'present',
                    date: { $gte: startDate, $lt: endDate }
                });

                // Calculate salary
                const monthlySalary = employee.salary * attendancePresentCount;
                const decimalSalary = Decimal.fromString(monthlySalary.toFixed(2));

                // Save calculated salary to PaySheet schema
                const newPaySheet = new PaySheetModel({
                    employeeNo: employee.employeeNo,
                    employeeName: employee.name,
                    year: yearNum,
                    month: monthNum,
                    salary: decimalSalary
                });

                await newPaySheet.save();
            }
        }
        res.status(200).send('Pay sheets generated successfully for all employees');
    } catch (error) {
        console.error('Error occurred while generating pay sheets:', error);
        res.status(500).send('Error occurred while generating pay sheets');
    }
});

//get all pay sheet for year month
app.get('/getAllPaySheetsByYearMonth', async (req, res) => {
    try {
        const { year, month } = req.query;

        // Validate year and month
        if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).send('Year and month must be numeric and are required');
        }

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).send('Month must be between 1 and 12');
        }

        // Query to find pay sheets by year and month
        const paySheetRecords = await PaySheetModel.find({ year: yearNum, month: monthNum });

        res.json(paySheetRecords);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//------- [End - API End Points] ----------------