import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import ProductForm from "./productForm";

export default function EditProductPage() {
  const [prodInfo, setProdInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    const prod = axios
      .get("/api/products?id=" + id)
      .then((res) => setProdInfo(res.data));
  }, [id]);
  return (
    <Layout>
      <h1>Edit An Existing Product</h1>
      {prodInfo && <ProductForm {...prodInfo} />}
    </Layout>
  );
}
