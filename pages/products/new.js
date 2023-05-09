import Layout from "@/components/Layout";
import ProductForm from "./edit/productForm";

export default function NewProduct() {
  return (
    <Layout>
      <h1>Add New Product</h1>
      <ProductForm />
    </Layout>
  );
}
