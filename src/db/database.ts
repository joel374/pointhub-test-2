import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  name: { type: "String", required: true },
  phone: { type: "String", required: true },
})

const InvoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  date: { type: "Date", required: true },
  total: { type: "Number", required: true },
})

export const CustomerModel = mongoose.model("Customer", CustomerSchema)
export const InvoiceModel = mongoose.model("Invoice", InvoiceSchema)
