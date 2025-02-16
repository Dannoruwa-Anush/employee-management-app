const mongoose = require('mongoose'); //Import mongoose package

//----- [Start - define Schema]----
//Note : schema - define collection structure 
//Note : sql (Table) = mongo db (Collection)

const employeeSchema = new mongoose.Schema({
    //fields of collection

    employeeNo  :{type : String, required : true, unique : true},
    name        :{type : String, required : true},
    nic         :{type : String, required : true},
    dateOfBirth :{type : Date, required : true},
    phoneNo     :{type : String, required : true},
    address     :{type : String, required : true},
    designation :{type : String, required : true},
    joiningDate :{type : Date, required : true},
    dailyWage   :{type: mongoose.Schema.Types.Decimal128, required: true}, // Use Decimal128 for double
    active      :{type : Boolean, required : true},
    createdAt   :{type : Date, default: Date.now},
    updatedAt   :{type : Date, default: Date.now},
});
//----- [End - define Schema]------


//----- [Start - Create Model & Export]------
//create model 
const employeeModel = mongoose.model('Employee', employeeSchema);

//Export model
module.exports = employeeModel;
//----- [End - Create Model & Export]--------