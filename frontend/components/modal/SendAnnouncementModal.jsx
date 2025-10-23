import React, { useState } from "react";
import { MdAnnouncement } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { post_data } from '../../services/PostMethod';

export default function AnnouncementModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    expiration: "",
  });
  const [loading, setLoading] = useState(false);

  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      const response = await post_data(formData, '/create-announcement');

      if(response.posted){
        onClose(); 
        setFormData({
          subject: "",
          message: "",
          expiration: "",
        })
      }
      
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }

    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-lg bg-white rounded-xl shadow-md p-6 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MdAnnouncement className="w-7 h-7 text-gray-800" />
            <h1 className="text-xl font-semibold tracking-tight text-black">
              New Announcement
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col space-y-4">
          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-black mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 outline-none"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-black mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Write your message..."
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 outline-none resize-none"
              required
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label
              htmlFor="expiration"
              className="block text-sm font-medium text-black mb-1"
            >
              Expiration Date
            </label>
            <input
              type="date"
              id="expiration"
              name="expiration"
              value={formData.expiration}
              onChange={handleChange}
              min={getTomorrowDate()}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-black hover:bg-black/80 transition text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded bg-black text-white hover:bg-green-500/80 transition text-sm"
          >
            <IoSend className="w-5 h-5" />
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
