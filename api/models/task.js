const mongoose = require('mongoose'); //Import mongoose package

//----- [Start - define Schema]----
//Note : schema - define collection structure 
//Note : sql (Table) = mongo db (Collection)

const taskSchema = new mongoose.Schema({
    //fields of collection

    employeeNo      :{type : String, required : true},
    employeeName    :{type : String, required : true},
    taskName        :{type : String, required : true},
    createdAt       :{type : Date, default: Date.now},
    taskStatus      :{type : String, required : true}, //completed or pending
});
//----- [End - define Schema]------


//----- [Start - Create Model & Export]------
//create model 
const taskModel = mongoose.model('Task', taskSchema);

//Export model
module.exports = taskModel;
//----- [End - Create Model & Export]--------