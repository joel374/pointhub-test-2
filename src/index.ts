import express, { Request, Response } from "express"
import { CustomerModel, InvoiceModel } from "./db/database"
import mongoose, { ConnectOptions } from "mongoose"

const app = express()
app.use(express.json())

mongoose.Promise = Promise
mongoose
  .connect("mongodb://127.0.0.1:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("mongodb connected"))
  .catch((error) => console.log(error))

app.post("/createInvoices", async (req: Request, res: Response) => {
  try {
    const { name, phone, date, total } = req.body
    const customer = new CustomerModel({ name, phone })
    await customer.save()

    const invoice = new InvoiceModel({ customer: customer._id, date, total })
    await invoice.save()

    return res.status(201).json({
      status: "success",
      message: "Invoice created",
      data: invoice,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
})

app.get("/invoices", async (req: Request, res: Response) => {
  try {
    const result = await InvoiceModel.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $project: { __v: 0, "customer.__v": 0, "customer._id": 0 },
      },
    ]).exec()
    return res.status(200).json({
      status: "success",
      data: result,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
})

app.listen(3000, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:3000`)
)
