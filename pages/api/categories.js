import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    const categoriesList = await Category.find().populate("parent");
    res.json(categoriesList);
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, _id, properties } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      { name, parent: parentCategory || undefined, properties }
    );
    res.status(200).json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("Category deleted Successsfully!");
  }
}
