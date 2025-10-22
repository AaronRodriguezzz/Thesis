// src/pages/HaircutForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { post_data } from "../../services/PostMethod";
import OptionCard from "../../components/ui/OptionCard";

export default function HaircutForm() {
  const [formData, setFormData] = useState({
    faceShape: "",
    hairType: "",
    hairLength: "",
    hairDensity: "",
    hairline: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageId, setImageId] = useState("");
  const [haircutInfo, setHairCutInfo] = useState({
    name: "",
    description: "",
  });

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await post_data(formData, "/haircut-suggestion");

      if (response) {
        console.log(response);
        setImageId(response.publicId);
        setHairCutInfo({
          name: response.name,
          description: response.description,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const generateMore = () => {
    setImageId("");
    setHairCutInfo({
      name: "",
      description: "",
    });
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!imageId) return;

    const response = await fetch(
      `https://res.cloudinary.com/dk3bbinj9/image/upload/${imageId}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "barber-suggestion.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {imageId ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl text-center"
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <img
                src={`https://res.cloudinary.com/dk3bbinj9/image/upload/${imageId}`}
                alt="haircut suggestion"
                className="w-full rounded-xl shadow-md mb-6"
              />
              <h2 className="text-2xl font-bold mb-3">{haircutInfo.name}</h2>
              <p className="text-gray-700">{haircutInfo.description}</p>

              <div className="flex gap-x-2 mt-6 justify-center">
                <button
                  onClick={generateMore}
                  className="border border-gray-200 py-1 px-4 rounded-lg"
                >
                  BACK
                </button>
                <button
                  onClick={async () => await handleDownload()}
                  className="bg-green-600 text-white px-4 py-1 rounded-lg shadow-md hover:bg-green-700"
                >
                  DOWNLOAD
                </button>
              </div>
            </>
          )}
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-black/40 text-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-8"
        >
          <h1 className="text-2xl font-bold text-center">
            Haircut Suggestion Form
          </h1>

          {/* Face Shape */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Face Shape</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OptionCard
                field="faceShape"
                value="oval"
                label="Oval"
                description="Balanced proportions, slightly longer than wide, rounded jaw."
                selected={formData.faceShape === "oval"}
                handleSelect={handleSelect}
              />
              <OptionCard
                field="faceShape"
                value="round"
                label="Round"
                description="Full cheeks, soft jawline, equal width and height."
                selected={formData.faceShape === "round"}
                handleSelect={handleSelect}
              />
              <OptionCard
                field="faceShape"
                value="square"
                label="Square"
                description="Strong jawline, broad forehead, equal proportions."
                selected={formData.faceShape === "square"}
                handleSelect={handleSelect}
              />
              <OptionCard
                field="faceShape"
                value="oblong"
                label="Oblong"
                description="Longer face shape with taller forehead."
                selected={formData.faceShape === "oblong"}
                handleSelect={handleSelect}
              />
              <OptionCard
                field="faceShape"
                value="heart"
                label="Heart"
                description="Wide forehead tapering to a narrow, pointed chin."
                selected={formData.faceShape === "heart"}
                handleSelect={handleSelect}
              />
              <OptionCard
                field="faceShape"
                value="diamond"
                label="Diamond"
                description="Narrow forehead and jawline, widest at cheekbones."
                selected={formData.faceShape === "diamond"}
                handleSelect={handleSelect}
              />
            </div>
          </section>

          {/* Hair Type */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hair Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["straight", "wavy", "curly", "coily"].map((type) => (
                <OptionCard
                  key={type}
                  field="hairType"
                  value={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  description={
                    {
                      straight: "Smooth, flat, and sleek hair strands.",
                      wavy: "Loose waves, adds natural volume.",
                      curly: "Bouncy curls with defined texture.",
                      coily: "Tight curls or coils with lots of volume.",
                    }[type]
                  }
                  selected={formData.hairType === type}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </section>

          {/* Hair Length */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hair Length</h2>
            <div className="grid grid-cols-3 gap-4">
              {["short", "medium", "long"].map((len) => (
                <OptionCard
                  key={len}
                  field="hairLength"
                  value={len}
                  label={len.charAt(0).toUpperCase() + len.slice(1)}
                  description={
                    {
                      short: "Ends above the ears or jawline.",
                      medium: "Falls around the shoulders.",
                      long: "Extends past the shoulders.",
                    }[len]
                  }
                  selected={formData.hairLength === len}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </section>

          {/* Hair Density */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hair Density</h2>
            <div className="grid grid-cols-3 gap-4">
              {["thin", "normal", "thick"].map((density) => (
                <OptionCard
                  key={density}
                  field="hairDensity"
                  value={density}
                  label={density.charAt(0).toUpperCase() + density.slice(1)}
                  description={
                    {
                      thin: "Light and airy, less volume.",
                      normal: "Balanced density with moderate volume.",
                      thick: "Dense and voluminous strands.",
                    }[density]
                  }
                  selected={formData.hairDensity === density}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </section>

          {/* Hairline */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hairline</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "straight", desc: "Even line across the forehead." },
                {
                  val: "widowsPeak",
                  desc: "V-shaped point at the center of forehead.",
                },
                {
                  val: "receding",
                  desc: "Gradual thinning around the temples.",
                },
              ].map((hl) => (
                <OptionCard
                  key={hl.val}
                  field="hairline"
                  value={hl.val}
                  label={
                    hl.val === "widowsPeak"
                      ? "Widow’s Peak"
                      : hl.val.charAt(0).toUpperCase() + hl.val.slice(1)
                  }
                  description={hl.desc}
                  selected={formData.hairline === hl.val}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </section>

          {/* Age */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Age</h2>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={(e) => handleSelect("age", e.target.value)}
              placeholder="Enter your age"
              className="w-full border rounded-lg p-3 placeholder:text-white"
            />
          </section>

          {/* Gender */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Gender</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "male", label: "Male", desc: "Masculine style preference." },
                {
                  val: "female",
                  label: "Female",
                  desc: "Feminine style preference.",
                },
                {
                  val: "other",
                  label: "Other",
                  desc: "Non-binary / custom style preference.",
                },
              ].map((g) => (
                <OptionCard
                  key={g.val}
                  field="gender"
                  value={g.val}
                  label={g.label}
                  description={g.desc}
                  selected={formData.gender === g.val}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg hover:bg-black font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
