import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      images,
      category,
    });
    res.json(product);
  }

  if (method === "PUT") {
    const { title, description, price, images, _id, category } = req.body;
    const updatedProd = await Product.updateOne(
      { _id },
      { title, description, price, images, category }
    );
    res.status(200).json(updatedProd);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.status(200).json("Product deleted successfully.");
    }
  }
}
