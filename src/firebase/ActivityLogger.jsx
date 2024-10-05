import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig"; // Adjust this import based on your file structure

const EXERCISE_COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes in milliseconds
const DAILY_COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to log activity
export const logActivity = async (userId, activity) => {
  const userDocRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User does not exist.");
  }

  const userData = userDoc.data();
  const currentTime = Date.now();

  // Get the last action timestamps
  const lastExerciseCompletion = userData.lastActionTime?.lastExerciseCompletion || 0;
  const lastDailyCompletion = userData.lastActionTime?.lastDailyCompletion || 0;

  // Validate exercise completion
  if (currentTime - lastExerciseCompletion < EXERCISE_COOLDOWN_PERIOD) {
    throw new Error("You must wait 5 minutes before completing another exercise.");
  }

  // Validate daily completion
  if (currentTime - lastDailyCompletion < DAILY_COOLDOWN_PERIOD) {
    throw new Error("You can only complete one daily exercise every 24 hours.");
  }

  // Proceed with logging the activity
  await updateDoc(userDocRef, {
    [`completedTasks.${activity}`]: true,
    lastActionTime: {
      ...userData.lastActionTime,
      lastExerciseCompletion: currentTime, // Update last exercise completion time
      lastDailyCompletion: currentTime,    // Update last daily completion time
    }
  });
};
