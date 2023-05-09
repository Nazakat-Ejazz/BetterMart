import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // method to list of categories
  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }

  // handle form submit to add new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editedCategory) {
      await axios.put("/api/categories", {
        name,
        parentCategory,
        properties: properties.map((p) => ({
          name: p.name,
          values: p.values.split(","),
        })),
        _id: editedCategory._id,
      });
      setEditedCategory(null);
      setName("");
      setParentCategory("");
    } else {
      await axios.post("/api/categories", {
        name,
        parentCategory,
        properties: properties.map((p) => ({
          name: p.name,
          values: p.values.split(","),
        })),
      });
    }
    setName("");
    fetchCategories();
    setParentCategory("");
    setProperties([]);
  };

  // to edit a category
  function editCategory(cat) {
    setEditedCategory(cat);
    setName(cat.name);
    setParentCategory(cat.parent?._id);
    setProperties(
      cat.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  // to delete a category
  function deleteCategory(cat) {
    swal
      .fire({
        title: "Are you sure ?",
        text: `Do you want to delete ${cat?.name}?`,
        showCancelButton: true,
        cancelButtonTitle: "Cancel",
        confirmButtonText: "Yes , Delete!",
        confirmButtonColor: "#FF0000",
        reverseButtons: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          // delete Category
          await axios.delete("/api/categories?_id=" + cat?._id);
          fetchCategories();
        }
      })
      .catch((err) => {});
  }

  // add properties
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  // edit new properties name
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  // edit new properties value
  function handlePropertyValuesChange(index, property, values) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = values;
      return properties;
    });
  }

  function removeProperty(index) {
    setProperties((prev) => {
      const newProperties = [...prev].filter((p, pIndex) => {
        return pIndex !== index;
      });
      return newProperties;
    });
  }

  return (
    <Layout>
      <h1 className="font-bold text-2xl">
        {" "}
        {editedCategory
          ? `Edit Category  ${editedCategory?.name}`
          : "List of Categories"}
      </h1>
      <div className="border-2 border-gray-200  p-3">
        <h3 className="font-semibold text-center underline italic">
          Create New Category
        </h3>
        <label>Category's Name</label>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-1 ">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category's name"
            />
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              defaultValue={"Select Parent Category"}
            >
              <option value="">No Parent Category</option>
              {categories.length > 0 &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block">Properties</label>
            <button
              type="button"
              onClick={addProperty}
              className="btn-default text-sm my-1"
            >
              Add New Property
            </button>
            {properties.length > 0 &&
              properties.map((p, index) => (
                <div className="flex gap-1 my-1" key={index}>
                  <input
                    type="text"
                    placeholder="like color , size..."
                    className="mb-0"
                    value={p.name}
                    onChange={(e) =>
                      handlePropertyNameChange(index, p, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="comma seperated values..."
                    value={p.values}
                    className="mb-0"
                    onChange={(e) =>
                      handlePropertyValuesChange(index, p, e.target.value)
                    }
                  />
                  <button
                    className="btn-red "
                    type="button"
                    onClick={() => removeProperty(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
          </div>

          <div className="flex gap-1">
            {editedCategory && (
              <button
                type="button"
                className="btn-red py-1"
                onClick={() => {
                  console.log("I was clicked!");
                  setEditedCategory(null);
                  setName("");
                  setParentCategory("");
                }}
              >
                Cancel
              </button>
            )}

            <button type="submit" className="btn-default py-1">
              Save
            </button>
          </div>
        </form>
      </div>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>{cat.parent?.name || "No Parent Category"}</td>
                  <td>
                    <button
                      className="btn-default mr-1"
                      onClick={() => editCategory(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-red mr-1"
                      onClick={() => deleteCategory(cat)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
