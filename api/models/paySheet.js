const mongoose = require('mongoose'); //Import mongoose package

//----- [Start - define Schema]----
//Note : schema - define collection structure 
//Note : sql (Table) = mongo db (Collection)

const paySheetSchema = new mongoose.Schema({
    //fields of collection

    employeeNo   : { type: String, required: true },
    employeeName : { type : String, required : true},
    year         : { type: Number, required: true },
    month        : { type: Number, required: true },
    salary       : { type: mongoose.Schema.Types.Decimal128, required: true },
});
//----- [End - define Schema]------


//----- [Start - Create Model & Export]------
//create model 
const paySheetModel = mongoose.model('PaySheet', paySheetSchema);

//Export model
module.exports = paySheetModel;
//----- [End - Create Model & Export]--------