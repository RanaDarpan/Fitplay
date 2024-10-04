import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword, loginWithEmailAndPassword } from '../firebase/Auth'; // Firebase auth functions

function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [otherFitnessGoal, setOtherFitnessGoal] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Validation function for form fields
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }

    if (isRegistering) {
      if (!name) errors.name = "Full Name is required";
      if (!age) {
        errors.age = "Age is required";
      } else if (age <= 0) {
        errors.age = "Age must be a positive number";
      } else if (age > 85) {
        errors.age = "Age cannot be more than 85";
      }

      if (!gender) errors.gender = "Gender is required";

      if (!fitnessGoals) {
        errors.fitnessGoals = "Fitness goals are required";
      } else if (fitnessGoals === "Other" && !otherFitnessGoal.trim()) {
        errors.otherFitnessGoal = "Please specify your fitness goals";
      }

      if (!height) {
        errors.height = "Height is required";
      } else if (height <= 0) {
        errors.height = "Height must be a positive number";
      }

      if (!weight) {
        errors.weight = "Weight is required";
      } else if (weight <= 0) {
        errors.weight = "Weight must be a positive number";
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        if (isRegistering) {
          const newUser = { 
            name, 
            age: Number(age), 
            gender, 
            fitnessGoals: fitnessGoals === "Other" ? otherFitnessGoal : fitnessGoals, 
            height: Number(height), 
            weight: Number(weight), 
            profileImage: profileImage ? profileImage.name : null 
          };
          await registerWithEmailAndPassword(email, password, newUser);
          alert('Registered successfully!');
        } else {
          await loginWithEmailAndPassword(email, password);
          alert('Logged in successfully!');
        }
        navigate("/dashboard", { replace: true });
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("Please fix the errors in the form.");
    }
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  // Fitness Goals Options
  const fitnessGoalsOptions = [
    "Lose Weight",
    "Build Muscle",
    "Improve Flexibility",
    "Increase Endurance",
    "Other"
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-purple-600 p-4">
      {/* Form container */}
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl backdrop-blur-md transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isRegistering ? "Create Account" : "Welcome Back!"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              {/* Age */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Age"
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                    formErrors.age ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="85"
                  required
                />
                {formErrors.age && <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>}
              </div>

              {/* Gender */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Gender</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600"
                      name="gender"
                      value="Other"
                      checked={gender === "Other"}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    />
                    <span className="ml-2 text-gray-700">Other</span>
                  </label>
                </div>
                {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
              </div>

              {/* Fitness Goals */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Fitness Goals</label>
                <select
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                    formErrors.fitnessGoals ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  required
                >
                  <option value="">Select your fitness goal</option>
                  {fitnessGoalsOptions.map((goal, index) => (
                    <option key={index} value={goal}>{goal}</option>
                  ))}
                </select>
                {formErrors.fitnessGoals && <p className="text-red-500 text-sm mt-1">{formErrors.fitnessGoals}</p>}
              </div>

              {/* Other Fitness Goal */}
              {fitnessGoals === "Other" && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Please specify your fitness goals"
                    className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                      formErrors.otherFitnessGoal ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                    value={otherFitnessGoal}
                    onChange={(e) => setOtherFitnessGoal(e.target.value)}
                    required
                  />
                  {formErrors.otherFitnessGoal && <p className="text-red-500 text-sm mt-1">{formErrors.otherFitnessGoal}</p>}
                </div>
              )}

              {/* Height */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                    formErrors.height ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="1"
                  required
                />
                {formErrors.height && <p className="text-red-500 text-sm mt-1">{formErrors.height}</p>}
              </div>

              {/* Weight */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                    formErrors.weight ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  required
                />
                {formErrors.weight && <p className="text-red-500 text-sm mt-1">{formErrors.weight}</p>}
              </div>

              {/* Profile Image */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 bg-gray-100 rounded-lg border ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={Object.keys(formErrors).length > 0}
          >
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <button
          className="w-full mt-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setFormErrors({});
            setError("");
          }}
        >
          {isRegistering ? "Already have an account? Login" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
