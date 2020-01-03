const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  birthDate : String,
  address :{ type: Schema.Types.ObjectId, ref: "Address" }

});

userSchema.pre("save",function(next){
  this.birthDate = new Date(this.birthDate).toLocaleDateString()
  next()
})

const User = mongoose.model('User', userSchema);
module.exports = User;
