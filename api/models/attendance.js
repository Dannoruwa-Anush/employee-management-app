const mongoose = require('mongoose'); //Import mongoose package

//----- [Start - define Schema]----
//Note : schema - define collection structure 
//Note : sql (Table) = mongo db (Collection)

const attendanceSchema = new mongoose.Schema({
    //fields of collection

    employeeNo      :{type : String, required : true},
    name            :{type : String, required : true},
    date            :{type : Date, required : true},
    status          :{type : String, required : true},
});
//----- [End - define Schema]------


//----- [Start - Create Model & Export]------
//create model 
const attendanceModel = mongoose.model('Attendance', attendanceSchema);

//Export model
module.exports = attendanceModel;
//----- [End - Create Model & Export]--------