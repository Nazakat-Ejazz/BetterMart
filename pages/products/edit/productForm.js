import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScaleLoader } from "react-spinners";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 5);
  const [images, setImages] = useState(existingImages || []);
  const [category, setCategory] = useState(existingCategory || "");

  const [goBack, setGoBack] = useState(false);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState(false);

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    // working
    e.preventDefault();
    const data = { title, description, price, images, category };
    if (_id) {
      // case when its an existing prod ; it has an id
      await axios.put("/api/products", { ...data, _id });
    } else {
      // when its a new product so no existing id
      await axios.post("/api/products", data);
    }

    setTitle("");
    setDescription("");
    setPrice(5);
    setGoBack(true);
  };

  if (goBack) {
    router.push("/products");
  }

  const uploadImages = async (e) => {
    //handle upload images
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((prevImages) => [...prevImages, ...res?.data?.allImages]);

      setIsUploading(false);
    }
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  return (
    <>
      <button
        className="flex items-center justify-center gap-1 text-blue-900 font-thick cursor-pointer bg-none mb-2"
        onClick={() => setGoBack(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-blue-900 font-thin "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        back
      </button>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter product name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((cat) => (
              <option value={cat?._id}>{cat?.name}</option>
            ))}
        </select>
        <label> Description</label>
        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Photos </label>
        <div className="flex flex-wrap gap-1 mb-2">
          <ReactSortable
            list={images}
            setList={updateImagesOrder}
            className="flex flex-wrap gap-1"
          >
            {!!images?.length &&
              images.map((link) => (
                <div
                  key={link}
                  className="h-24 border-2 border-gray-400 rounded-md"
                >
                  <img
                    src={link}
                    className="rounded-md overflow-hidden outline-none"
                  />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 border-2 border-gray-400 rounded-md p-2">
              <ScaleLoader
                className="text-center text-blue-900"
                color="#1E3A89"
              />
              <span className="text-center text-blue-900">Uploading...</span>
            </div>
          )}
          <label className="w-24 h-24 border-2 text-center text-gray-500 flex items-center justify-center border-gray-300 text-sm gap-1 rounded-md bg-gray-100 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
            <input
              type="file"
              onChange={uploadImages}
              className="hidden"
              multiple
            />
          </label>
          {!images?.length && <div>No images to show</div>}
        </div>

        <label>Price($)</label>
        <input
          type="number"
          min={5}
          step={1}
          placeholder="5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          {(!_id && "Add to Store") || " Save Changes"}
        </button>
      </form>
    </>
  );
}
