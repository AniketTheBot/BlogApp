import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAccount } from "../../store/authSlice"; // Import your new thunk
import Button from "../../components/Button"; // Your reusable Button
import Input from "../../components/Input"; // Your reusable Input

function UserInfo() {
  const dispatch = useDispatch();
  // Get the full user data object and any potential errors from the auth slice
  const { userData, error: authError } = useSelector((state) => state.auth);

  // Local state to manage the input field for the new name
  const [name, setName] = useState(userData?.name || "");
  // Local state for loading, specific to this form's submission
  const [loading, setLoading] = useState(false);
  // Local state for success messages
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(""); // Clear previous success messages

    try {
      // Dispatch the thunk with the new name from our local state
      await dispatch(updateUserAccount(name)).unwrap();
      // If it doesn't throw, it was successful
      setSuccessMessage("Name updated successfully!");
    } catch (error) {
      // The error from the rejected thunk will be caught here
      // The global authError will also be set, but you can handle it here too
      console.error("Failed to update name:", error);
    } finally {
      // This runs whether the try or catch block finished
      setLoading(false);
    }
  };

  // If for some reason userData is not available, show a loading/error message
  if (!userData) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 border-b pb-4">
        Your Profile Information
      </h2>

      {/* Display User Info */}
      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg text-gray-800">{userData.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">User ID</p>
          <p className="text-lg text-gray-800 font-mono text-sm">
            {userData.$id}
          </p>
        </div>
      </div>

      {/* Form to Update Name */}
      <h3 className="text-xl font-semibold mb-4">Update Your Name</h3>
      <form onSubmit={handleUpdateName} className="space-y-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your new name"
        />

        {/* Display any success or error messages */}
        {authError && <p className="text-red-500 text-sm">{authError}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? "Updating..." : "Update Name"}
        </Button>
      </form>

      {/* You can add forms for updating email and password here later */}
    </div>
  );
}

export default UserInfo;
