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

        // ✅ Validation
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
            // No new image → plain JSON
            const { imagePath, ...rest } = productPayload;
            dataToSend = { id: dataToUpdate._id, ...rest };
            }

            const response = await update_data(route, dataToSend);

            if (response?.updatedInfo) {
            setUpdatedData((prev) =>
                prev.map((item) =>
                item._id === response.updatedInfo._id
                    ? response.updatedInfo
                    : item
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

        onCancel(false); // ✅ Close modal after success
        } catch (err) {
        console.error(err);
        CustomAlert("error", "Something went wrong. Please try again.");
        }
    };

    /** 📌 Handle File Selection */
    const handleFileClick = () => fileInputRef.current.click();

    const handleChangeFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
        const imageURL = URL.createObjectURL(selectedFile);
        setDisplayedImage(imageURL);
        setProductPayload({ ...productPayload, imagePath: selectedFile });
        }
    };

    /** 📌 On edit mode → set default image & branch count */
    useEffect(() => {
        if (dataToUpdate) {
        setDisplayedImage(`${baseUrl}/${productPayload.imagePath}`);
        setNumberOfBranch(dataToUpdate.branch.length);
        }
    }, [dataToUpdate]);

    /** 📌 Fetch branches on mount */
    useEffect(() => {
        const getBranches = async () => {
        const data = await get_data("/get_data/branch");
        if (data) setBranches(data);
        };
        getBranches();
    }, []);

  if (!displayedImage && !dataToUpdate) return null;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-transparent fixed top-0 left-0 z-50">
      <form
        className="w-[90%] max-w-[400px] bg-white rounded-lg shadow-lg p-5 shadow-gray-400"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold mb-4 tracking-tight">
          {dataToUpdate ? "Update Product" : "New Product"}
        </h1>

        

        <div className="relative flex flex-col tracking-tighter">
          {/* Upload Image */}
            <div
                className="w-[150px] h-[170px] mx-auto border-2 border-gray-200 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat"
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
                <h1
                    className="p-4 rounded-xl border-dotted border-2 border-gray-200 text-3xl font-semibold text-gray-200"
                    style={displayedImage ? { opacity: 0.5, border: "none" } : {}}
                >
                    +
                </h1>
            </div>

          {/* Number of Branch */}
            <h1 className="mt-2">Number of Branch</h1>
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
                className="border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
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

            {/* Name */}
            <h1 className="mt-2">Product Name</h1>
            <input
                type="text"
                value={productPayload.name}
                maxLength={25}
                onChange={(e) =>
                setProductPayload({
                    ...productPayload,
                    name: e.target.value.toUpperCase(),
                })
                }
                className="border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
            />

            {/* Price */}
            <h1 className="mt-2">Price</h1>
            <input
                type="number"
                value={productPayload.price}
                onChange={(e) =>
                setProductPayload({ ...productPayload, price: e.target.value })
                }
                className="border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
            />

            {/* Branches + Stocks */}
            {Array.from({ length: numberOfBranch }).map((_, index) => (
                <div key={index} className="flex gap-x-1">
                <div className="w-[70%]">
                    <h1 className="mt-2">Branch {index + 1}</h1>
                    <select
                    value={productPayload?.branch[index] || ""}
                    className="w-full border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
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

                <div className="w-[30%]">
                    <h1 className="mt-2">Stock</h1>
                    <input
                    type="number"
                    value={productPayload.stock[index] || ""}
                    className="w-full border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
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
            <h1 className="mt-2">Description</h1>
            <textarea
                value={productPayload.description}
                onChange={(e) =>
                setProductPayload({
                    ...productPayload,
                    description: e.target.value,
                })
                }
                className="border border-gray-200 px-3 py-1 rounded-md focus:border-gray-300"
                maxLength={100}
            />

            <p
                className={`text-sm mt-1 ${
                productPayload.description.length === 100
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
            >
                {productPayload.description.length}/100 characters
            </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
            <button
                type="button"
                onClick={() => onCancel(false)}
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
                Cancel
            </button>

            <button
                type="submit"
                className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Finish
            </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
