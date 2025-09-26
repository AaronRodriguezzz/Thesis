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
    setImageId('');
    setHairCutInfo({
      name: '',
      description: '',
    });
  }


  const handleDownload = async () => {
    const response = await fetch(`https://res.cloudinary.com/dk3bbinj9/image/upload/${imageId}`);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* If we already have a suggestion, show result instead of form */}
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
                <button  onClick={generateMore} className="border-1 border-gray-200 py-1 px-4 rounded-lg">BACK</button>
                <button onClick={async () => await handleDownload()} className="bg-green-600 text-white px-4 py-1 rounded-lg shadow-md hover:bg-green-700">DOWNLOAD</button>
                {/* <a
                  href={`https://res.cloudinary.com/dk3bbinj9/image/upload/${imageId}`}
                  download="haircut-suggestion.jpg"
                  className="bg-green-600 text-white px-4 py-1 rounded-lg shadow-md hover:bg-green-700"
                >
                  DOWNLOAD
                </a>               */}
              </div>
            </>
          )}
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center">
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
              />
              <OptionCard
                field="faceShape"
                value="round"
                label="Round"
                description="Full cheeks, soft jawline, equal width and height."
              />
              <OptionCard
                field="faceShape"
                value="square"
                label="Square"
                description="Strong jawline, broad forehead, equal proportions."
              />
              <OptionCard
                field="faceShape"
                value="oblong"
                label="Oblong"
                description="Longer face shape with taller forehead."
              />
              <OptionCard
                field="faceShape"
                value="heart"
                label="Heart"
                description="Wide forehead tapering to a narrow, pointed chin."
              />
              <OptionCard
                field="faceShape"
                value="diamond"
                label="Diamond"
                description="Narrow forehead and jawline, widest at cheekbones."
              />
            </div>
          </section>

          {/* Hair Type */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hair Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OptionCard
                field="hairType"
                value="straight"
                label="Straight"
                description="Smooth, flat, and sleek hair strands."
              />
              <OptionCard
                field="hairType"
                value="wavy"
                label="Wavy"
                description="Loose waves, adds natural volume."
              />
              <OptionCard
                field="hairType"
                value="curly"
                label="Curly"
                description="Bouncy curls with defined texture."
              />
              <OptionCard
                field="hairType"
                value="coily"
                label="Coily"
                description="Tight curls or coils with lots of volume."
              />
            </div>
          </section>

          {/* Hair Length */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hair Length</h2>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                field="hairLength"
                value="short"
                label="Short"
                description="Ends above the ears or jawline."
              />
              <OptionCard
                field="hairLength"
                value="medium"
                label="Medium"
                description="Falls around the shoulders."
              />
              <OptionCard
                field="hairLength"
                value="long"
                label="Long"
                description="Extends past the shoulders."
              />
            </div>
          </section>

          {/* Hair Density */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hair Density</h2>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                field="hairDensity"
                value="thin"
                label="Thin"
                description="Light and airy, less volume."
              />
              <OptionCard
                field="hairDensity"
                value="normal"
                label="Normal"
                description="Balanced density with moderate volume."
              />
              <OptionCard
                field="hairDensity"
                value="thick"
                label="Thick"
                description="Dense and voluminous strands."
              />
            </div>
          </section>

          {/* Hairline */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Hairline</h2>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                field="hairline"
                value="straight"
                label="Straight"
                description="Even line across the forehead."
              />
              <OptionCard
                field="hairline"
                value="widowsPeak"
                label="Widow’s Peak"
                description="V-shaped point at the center of forehead."
              />
              <OptionCard
                field="hairline"
                value="receding"
                label="Receding"
                description="Gradual thinning around the temples."
              />
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
              className="w-full border rounded-lg p-3"
            />
          </section>

          {/* Gender */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Gender</h2>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                field="gender"
                value="male"
                label="Male"
                description="Masculine style preference."
              />
              <OptionCard
                field="gender"
                value="female"
                label="Female"
                description="Feminine style preference."
              />
              <OptionCard
                field="gender"
                value="other"
                label="Other"
                description="Non-binary / custom style preference."
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
