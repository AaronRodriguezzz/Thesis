import React, { useState } from "react";
import { motion } from "framer-motion";
import { post_data } from "../../services/PostMethod";

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

  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      setLoading(true)
      const response = await post_data(formData, '/haircut-suggestion');

      if(response){
        console.log(response);
        setImage(response.image);
        setText(response.text);
      }

    }catch(err){
      console.log(err)
    }finally{
      setLoading(false);
    }
  };

  const OptionCard = ({ field, value, label, description }) => {
    const selected = formData[field] === value;
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`p-4 border rounded-xl shadow-md cursor-pointer transition ${
          selected ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onClick={() => handleSelect(field, value)}
      >
        <h3 className="text-lg font-semibold">{label}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        {selected && <p className="mt-2 text-blue-600 font-medium">✔ Selected</p>}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
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
          className="w-full bg-blue-600 text-wh ite py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Submit
        </button>
      </form>


      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {image && <img src={image} alt="haircut suggestion" />}
          </>
        )}
      </div>
      
    </div>
  );
}
