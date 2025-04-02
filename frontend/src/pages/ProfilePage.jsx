import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ 
        profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen pt-20 bg-black text-white">
      <div className="max-w-3xl mx-auto p-6 py-10">
        <div className="bg-black bg-opacity-80 rounded-xl p-8 space-y-10 shadow-xl border-4 border-gray-400 hover:shadow-[0_0_15px_rgba(128,128,128,0.8)] transition-transform hover:scale-105 animate-glow">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white animate-pulse glow-text">Your Profile</h1>
            <p className="text-gray-400 text-sm">View and update your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-400 shadow-xl transition-transform hover:scale-105 hover:shadow-[0_0_15px_rgba(128,128,128,0.8)] animate-glow"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-gray-400 p-2 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-gray-500 hover:shadow-[0_0_15px_rgba(128,128,128,0.8)] ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-black" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera to change your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="px-4 py-3 bg-black rounded-lg text-white border-4 border-gray-400 shadow-[0_0_15px_rgba(128,128,128,0.8)]">
                {authUser?.fullname}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <div className="px-4 py-3 bg-black rounded-lg text-white border-4 border-gray-400 shadow-[0_0_15px_rgba(128,128,128,0.8)]">
                {authUser?.email}
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-black border-4 border-gray-400 shadow-[0_0_15px_rgba(128,128,128,0.8)] animate-fade-in">
            <h2 className="text-xl font-medium text-white mb-4">Account Information</h2>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center justify-between py-2 border-b border-gray-400">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
