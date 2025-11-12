import React, { useEffect, useState, useRef } from "react";
import { update_data } from "../../services/PutMethod";
import { get_data } from "../../services/GetMethod";
import { post_data } from "../../services/PostMethod";
import { CustomAlert } from "./CustomAlert";

const NewProduct = ({ onCancel, route, setUpdatedData, dataToUpdate = null }) => {
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:4001"
      : "https://tototumbs.onrender.com";

  const defaultProduct = {
    name: dataToUpdate?.name || "",
    imagePath: dataToUpdate?.imagePath || "",
    price: dataToUpdate?.price || "",
    stock: dataToUpdate?.stock || [],
    branch: dataToUpdate?.branch || [],
    description: dataToUpdate?.description || "",
    uploadType: "products",
  };

  const fileInputRef = useRef(null);
  const [branches, setBranches] = useState([]);
  const [productPayload, setProductPayload] = useState(defaultProduct);
  const [numberOfBranch, setNumberOfBranch] = useState("");
  const [displayedImage, setDisplayedImage] = useState("");

  /** 📌 Handle Add / Update Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productPayload.description.length > 100) {
      CustomAlert("error", "Product Description is too long");
      return;
    }
    if (productPayload.name.length > 25) {
      CustomAlert("error", "Product name max length is 25 symbols");
      return;
    }

    try {
      if (dataToUpdate) {
        // 🔹 UPDATE MODE
        let dataToSend;

        if (productPayload.imagePath instanceof File) {
          const formData = new FormData();
          formData.append("id", dataToUpdate._id);

          Object.entries(productPayload).forEach(([key, value]) => {
            if (key !== "imagePath") formData.append(key, value);
          });

          formData.append("image", productPayload.imagePath);
          dataToSend = formData;
        } else {
          const { imagePath, ...rest } = productPayload;
          dataToSend = { id: dataToUpdate._id, ...rest };
        }

        const response = await update_data(route, dataToSend);

        if (response?.updatedInfo) {
          setUpdatedData((prev) =>
            prev.map((item) =>
              item._id === response.updatedInfo._id ? response.updatedInfo : item
            )
          );
        }
      } else {
        // 🔹 ADD MODE
        const formData = new FormData();
        Object.entries(productPayload).forEach(([key, value]) => {
          if (key !== "imagePath") formData.append(key, value);
        });

        if (!(productPayload.imagePath instanceof File)) {
          CustomAlert("error", "You must provide a valid image (jpg, png..)");
          return;
        }

        formData.append("image", productPayload.imagePath);

        const result = await post_data(formData, route);

        if (result?.added) {
          setUpdatedData((prev) => [...prev, result.product]);
        }
      }

      onCancel(false);
    } catch (err) {
      console.error(err);
      CustomAlert("error", "Something went wrong. Please try again.");
    }
  };

  /** 📸 Image Input Handlers */
  const handleFileClick = () => fileInputRef.current.click();

  const handleChangeFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);
      setDisplayedImage(imageURL);
      setProductPayload({ ...productPayload, imagePath: selectedFile });
    }
  };

  /** 🧠 On Edit Mode */
  useEffect(() => {
    if (dataToUpdate) {
      setDisplayedImage(`${baseUrl}/${productPayload.imagePath}`);
      setNumberOfBranch(dataToUpdate.branch.length);
    }
  }, [dataToUpdate]);

  /** 🏢 Fetch Branches */
  useEffect(() => {
    const getBranches = async () => {
      const data = await get_data("/get_data/branch");
      if (data) setBranches(data);
    };
    getBranches();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-[420px] bg-white text-black rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          {dataToUpdate ? "Update Product" : "New Product"}
        </h1>

        {/* Image Upload */}
        <div
          className="w-[160px] h-[180px] mx-auto mb-5 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat cursor-pointer transition-transform hover:scale-105"
          style={displayedImage ? { backgroundImage: `url(${displayedImage})` } : {}}
          onClick={handleFileClick}
        >
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChangeFile}
          />
          <span
            className={`text-4xl font-bold text-gray-400 ${
              displayedImage ? "opacity-0" : ""
            }`}
          >
            +
          </span>
        </div>

        {/* Number of Branch */}
        <label className="block mt-2">
          Number of Branch
        </label>
        <select
          value={numberOfBranch}
          onChange={(e) => {
            const count = Number(e.target.value);
            setNumberOfBranch(count);
            setProductPayload({
              ...productPayload,
              branch: productPayload.branch.slice(0, count),
              stock: productPayload.stock.slice(0, count),
            });
          }}
          className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="" disabled>
            Select Number of Branch
          </option>
          {branches.map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>

        {/* Product Name */}
        <label className="block mt-3">
          Product Name
        </label>
        <input
          type="text"
          value={productPayload.name}
          maxLength={22}
          onChange={(e) =>
            setProductPayload({
              ...productPayload,
              name: e.target.value.toUpperCase(),
            })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Price */}
        <label className="block mt-3">Price</label>
        <input
          type="number"
          value={productPayload.price}
          onChange={(e) =>
            setProductPayload({ ...productPayload, price: e.target.value })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Branches and Stocks */}
        {Array.from({ length: numberOfBranch }).map((_, index) => (
          <div key={index} className="flex gap-2 mt-3">
            <div className="w-2/3">
              <label className="block">
                Branch {index + 1}
              </label>
              <select
                value={productPayload?.branch[index] || ""}
                className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setProductPayload((prev) => {
                    const updatedBranches = [...prev.branch];
                    updatedBranches[index] = e.target.value;
                    return { ...prev, branch: updatedBranches };
                  })
                }
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches
                  .filter(
                    (branch) =>
                      !productPayload.branch?.find(
                        (id, i) =>
                          i !== index && String(id) === String(branch._id)
                      )
                  )
                  .map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="w-1/3">
              <label className="block">Stock</label>
              <input
                type="number"
                value={productPayload.stock[index] || ""}
                className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setProductPayload((prev) => {
                    const updatedStocks = [...prev.stock];
                    updatedStocks[index] = e.target.value;
                    return { ...prev, stock: updatedStocks };
                  })
                }
              />
            </div>
          </div>
        ))}

        {/* Description */}
        <label className="block mt-3">
          Description
        </label>
        <textarea
          value={productPayload.description}
          onChange={(e) =>
            setProductPayload({
              ...productPayload,
              description: e.target.value,
            })
          }
          maxLength={100}
          rows={3}
          className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
        />

        <p
          className={`text-xs mt-1 text-right ${
            productPayload.description.length === 100
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {productPayload.description.length}/100 characters
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={() => onCancel(false)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition text-gray-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Finish
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
