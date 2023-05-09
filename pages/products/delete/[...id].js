import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [prodInfo, setProdInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => {
      setProdInfo(res.data);
    });
  }, [id]);

  function goBack() {
    router.push("/products");
  }

  const deleteProd = async () => {
    await axios.delete("/api/products?id=" + id);
    goBack();
  };

  return (
    <Layout>
      <h3 className="text-center">
        Click yes to delete &nbsp;"
        {prodInfo?.title.charAt(0).toUpperCase() + prodInfo?.title.substring(1)}
        " ?
      </h3>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProd} className="btn-red">
          YES
        </button>
        <button onClick={goBack} className="btn-default">
          NO
        </button>
      </div>
    </Layout>
  );
}
