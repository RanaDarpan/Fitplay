
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth, firestore } from './Firebase'; // Updated import path
// import { doc, setDoc } from 'firebase/firestore';


// export const registerWithEmailAndPassword = async (email, password, additionalInfo) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Save additional user information to Firestore
//     await setDoc(doc(firestore, 'users', user.uid), {
//       email,
//       ...additionalInfo // Spread additional info
//     });

//     return user;
//   } catch (error) {
//     console.error('Error registering user:', error);
//     throw error;
//   }
// };
// // Login an existing user
// export const loginWithEmailAndPassword = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     return userCredential.user;
//   } catch (error) {
//     console.error('Error logging in user:', error);
//     throw error;
//   }
// };

// // Logout user
// export const logoutUser = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.error('Error logging out:', error);
//     throw error;
//   }
// };


// src/firebase/Auth.js

import { auth, firestore, storage } from './Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Registers a new user with email and password, along with additional user information.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {Object} newUser - Additional user information.
 * @returns {Promise<void>}
 */
export const registerWithEmailAndPassword = async (email, password, newUser) => {
  // Create user with email and password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update user profile with display name if provided
  if (newUser.name) {
    await updateProfile(user, {
      displayName: newUser.name,
    });
  }

  // Prepare user data to store in Firestore
  const userData = {
    email: user.email,
    name: newUser.name || "",
    age: newUser.age || "",
    gender: newUser.gender || "",
    fitnessGoals: newUser.fitnessGoals || "",
    height: newUser.height || "",
    weight: newUser.weight || "",
    profileImageURL: newUser.profileImageURL || "", // Store the image URL if available
    completedTasks: {}, // Initialize as empty
  };

  // Store user data in Firestore
  await setDoc(doc(firestore, "users", user.uid), userData);
};

/**
 * Logs in a user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<void>}
 */
export const loginWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};
