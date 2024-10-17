// src/Components/Progress.jsx

import React, { useState, useEffect } from "react";
import { workoutPlan } from "./workoutData";
import { auth, firestore } from "../firebase/Firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const Progress = ({ updateActivityPoints }) => {
  const [progress, setProgress] = useState([]);
  const [notification, setNotification] = useState("");
  const [dailyPoints, setDailyPoints] = useState([]);
  const [completedWeeks, setCompletedWeeks] = useState([0]); // Initially, only Week 0 is unlocked
  const [isLoading, setIsLoading] = useState(false); // Loading state to manage multiple updates
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const completedTasks = userData.completedTasks || {};
          const userCompletedWeeks = userData.completedWeeks || [0];

          // Merge completedTasks with workoutPlan
          const mergedProgress = workoutPlan.map((week, weekIndex) => ({
            ...week,
            days: week.days.map((day, dayIndex) => {
              const exercisesCompleted =
                completedTasks[weekIndex]?.[dayIndex]
                  ? Object.keys(completedTasks[weekIndex][dayIndex]).length
                  : 0;
              const isDayCompleted = exercisesCompleted === day.exercises.length;

              return {
                ...day,
                completed: isDayCompleted,
                exercises: day.exercises.map((exercise, exerciseIndex) => ({
                  ...exercise,
                  completed:
                    completedTasks[weekIndex]?.[dayIndex]?.[exerciseIndex] ||
                    false,
                })),
              };
            }),
          }));

          setProgress(mergedProgress);
          setCompletedWeeks(userCompletedWeeks);
          calculatePoints(mergedProgress, userCompletedWeeks);
        } else {
          // Initialize user data if it doesn't exist
          await setDoc(doc(firestore, "users", user.uid), {
            completedTasks: {},
            completedWeeks: [0],
          });
          setProgress(workoutPlan);
          setCompletedWeeks([0]);
          calculatePoints(workoutPlan, [0]);
        }
      } else {
        // Guest user: show only Week 0
        const guestProgress = workoutPlan.map((week, weekIndex) =>
          weekIndex === 0 ? { ...week } : { ...week, days: [] }
        );
        setProgress(guestProgress);
        setCompletedWeeks([]);
        calculatePoints(guestProgress, []);
      }
    };

    fetchProgress();
  }, [user]);

  // Toggle exercise completion with enhanced validation
  const toggleExerciseComplete = async (weekIndex, dayIndex, exerciseIndex) => {
    if (isLoading) return; // Prevent action if already loading

    if (!user && weekIndex > 0) {
      setNotification("Guest users can only complete Week 1 tasks.");
      return;
    }

    const updatedPlan = [...progress];
    const currentStatus =
      updatedPlan[weekIndex].days[dayIndex].exercises[exerciseIndex].completed;

    // Check if the previous day is completed
    if (dayIndex === 0 || updatedPlan[weekIndex].days[dayIndex - 1].completed) {
      // Only toggle the exercise if the day is not completed
      if (!updatedPlan[weekIndex].days[dayIndex].completed) {
        setIsLoading(true); 
        setNotification(""); // Clear previous notifications

        try {
          // Optimistically update the UI
          updatedPlan[weekIndex].days[dayIndex].exercises[exerciseIndex].completed =
            !currentStatus;
          setProgress(updatedPlan);

          // Update Firestore
          await updateProgressInFirestore(
            weekIndex,
            dayIndex,
            exerciseIndex,
            !currentStatus
          );

          // Recalculate points
          calculatePoints(updatedPlan, completedWeeks);

          // Check if week should be unlocked
          await unlockNextWeek(weekIndex, updatedPlan);
        } catch (error) {
          console.error("Error updating progress:", error);
          setNotification("Error updating progress. Please try again.");
          // Revert the optimistic update
          updatedPlan[weekIndex].days[dayIndex].exercises[exerciseIndex].completed =
            currentStatus;
          setProgress(updatedPlan);
        } finally {
          setIsLoading(false); // End loading
        }
      }
    } else {
      setNotification(`Complete Day ${dayIndex} before Day ${dayIndex + 1}`);
    }
  };

  // Toggle day completion with enhanced validation
  const toggleDayComplete = async (weekIndex, dayIndex) => {
    if (isLoading) return; // Prevent action if already loading

    if (!user && weekIndex > 0) {
      setNotification("Guest users can only complete Week 1 tasks.");
      return;
    }

    const updatedPlan = [...progress];
    // Check if all exercises for the day are completed
    const allExercisesCompleted = updatedPlan[weekIndex].days[dayIndex].exercises.every(
      (exercise) => exercise.completed
    );

    if (!allExercisesCompleted) {
      setNotification("Complete all exercises to finish the day.");
      return;
    }

    // Mark the day as completed
    updatedPlan[weekIndex].days[dayIndex].completed = true;
    setProgress(updatedPlan);
    setNotification(""); // Clear notification

    setIsLoading(true); // Start loading

    try {
      // Update Firestore to reflect this change
      await updateProgressInFirestore(weekIndex, dayIndex, null, true);

      // Recalculate points
      calculatePoints(updatedPlan, completedWeeks);

      // Check if the entire week is completed and unlock the next week if necessary
      const currentWeekCompleted = updatedPlan[weekIndex].days.every(
        (day) => day.completed
      );

      if (currentWeekCompleted) {
        await unlockNextWeek(weekIndex, updatedPlan);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      setNotification("Error updating progress. Please try again.");
      // Revert the optimistic update
      updatedPlan[weekIndex].days[dayIndex].completed = false;
      setProgress(updatedPlan);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Calculate points based on completed exercises
  const calculatePoints = (updatedPlan, unlockedWeeks) => {
    let dailyPointsArray = [];

    updatedPlan.forEach((week, weekIndex) => {
      if (unlockedWeeks.includes(weekIndex)) {
        week.days.forEach((day) => {
          let dayPoints = 0;
          day.exercises.forEach((exercise) => {
            if (exercise.completed) {
              dayPoints += 5; // 5 points per completed exercise
            }
          });
          dailyPointsArray.push({ day: day.day, points: dayPoints });
        });
      }
    });

    setDailyPoints(dailyPointsArray);
    updateActivityPoints(dailyPointsArray);
  };

  // Unlock the next week if the current week is completed
  const unlockNextWeek = async (weekIndex, updatedPlan) => {
    const currentWeekCompleted = updatedPlan[weekIndex].days.every(
      (day) => day.completed
    );

    if (currentWeekCompleted && weekIndex < workoutPlan.length - 1) {
      const newWeekIndex = weekIndex + 1;
      if (!completedWeeks.includes(newWeekIndex)) {
        // Use functional state update to ensure latest state
        setCompletedWeeks((prevCompletedWeeks) => {
          const updatedCompletedWeeks = [...prevCompletedWeeks, newWeekIndex];

          // Update Firestore with the updatedCompletedWeeks
          updateDoc(doc(firestore, "users", user.uid), {
            completedWeeks: updatedCompletedWeeks,
          }).catch((error) => {
            console.error("Error updating Firestore:", error);
            setNotification("Error unlocking the next week. Please try again.");
          });

          // Notify the user that a new week has been unlocked
          setNotification(`Week ${newWeekIndex + 1} has been unlocked!`);

          return updatedCompletedWeeks;
        });
      }
    }
  };

  // Update progress in Firestore
  const updateProgressInFirestore = async (
    weekIndex,
    dayIndex,
    exerciseIndex,
    completed // Boolean or null
  ) => {
    if (!user) return;

    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const existingData = userDoc.exists() ? userDoc.data() : {};

      let updatedCompletedTasks = existingData.completedTasks || {};

      if (exerciseIndex !== null) {
        // Update specific exercise
        if (!updatedCompletedTasks[weekIndex]) {
          updatedCompletedTasks[weekIndex] = {};
        }
        if (!updatedCompletedTasks[weekIndex][dayIndex]) {
          updatedCompletedTasks[weekIndex][dayIndex] = {};
        }
        if (completed) {
          updatedCompletedTasks[weekIndex][dayIndex][exerciseIndex] = true;
        } else {
          // Remove the completed status
          if (updatedCompletedTasks[weekIndex][dayIndex]) {
            delete updatedCompletedTasks[weekIndex][dayIndex][exerciseIndex];
            if (
              Object.keys(updatedCompletedTasks[weekIndex][dayIndex]).length ===
              0
            ) {
              delete updatedCompletedTasks[weekIndex][dayIndex];
            }
          }
        }
      } else if (completed === true) {
       
      }

      await updateDoc(userDocRef, {
        completedTasks: updatedCompletedTasks,
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      setNotification("Error updating progress. Please try again.");
      throw error; // Rethrow to handle in the calling function
    }
  };

  return (
    <div className="workout-container p-4 max-w-4xl mx-auto">
      {notification && (
        <div className="bg-yellow-200 text-yellow-800 p-2 rounded mb-4">
          {notification}
        </div>
      )}
      {progress.map((week, weekIndex) => (
        <details
          key={weekIndex}
          className={`p-4 border rounded mb-4 ${
            weekIndex > 0 && !completedWeeks.includes(weekIndex)
              ? "pointer-events-none opacity-50"
              : ""
          }`}
          open={completedWeeks.includes(weekIndex)}
        >
          <summary className="text-lg font-semibold">Week {week.week}</summary>
          <table className="w-full mt-4 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Day</th>
                <th className="px-4 py-2 text-left">Exercise</th>
                <th className="px-4 py-2 text-left">Reps/Sets</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {completedWeeks.includes(weekIndex) &&
                week.days.map((day, dayIndex) => (
                  <React.Fragment key={dayIndex}>
                    {/* Day Row */}
                    <tr
                      className={`${
                        dayIndex > 0 && !week.days[dayIndex - 1].completed
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      {/* Day */}
                      <td className="px-4 py-2 text-sm md:text-base">
                        {day.day}
                      </td>

                      {/* Empty Exercise Cell */}
                      <td className="px-4 py-2 text-sm md:text-base"></td>

                      {/* Empty Reps/Sets Cell */}
                      <td className="px-4 py-2 text-sm md:text-base"></td>

                      {/* Status */}
                      <td className="px-4 py-2 text-sm md:text-base">
                        {!day.completed ? (
                          <button
                            onClick={() => toggleDayComplete(weekIndex, dayIndex)}
                            disabled={day.completed || day.exercises.length === 0 || isLoading}
                            className={`${
                              day.completed
                                ? "bg-green-200 cursor-not-allowed"
                                : "bg-blue-500 text-white"
                            } py-1 px-3 rounded`}
                          >
                            {isLoading ? "Updating..." : day.completed ? "Done✅" : "❌ "}
                          </button>
                        ) : (
                          <span className="text-green-500 font-semibold">
                            Completed✅
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Exercise Rows */}
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <tr
                        key={exerciseIndex}
                        className={`${
                          exerciseIndex > 0 && !day.exercises[exerciseIndex - 1].completed
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      >
                        {/* Empty Day Cell */}
                        <td className="px-4 py-2 text-sm md:text-base"></td>

                        {/* Exercise Name */}
                        <td className="px-4 py-2 text-sm md:text-base">
                          {exercise.name}
                        </td>

                        {/* Reps/Sets */}
                        <td className="px-4 py-2 text-sm md:text-base">
                          {exercise.reps}/{exercise.sets}
                        </td>

                        {/* Checkbox Status */}
                        <td className="px-4 py-2">
                          {day.completed ? (
                            <input
                              type="checkbox"
                              checked={exercise.completed}
                              readOnly
                              className="h-4 w-4"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={exercise.completed}
                              onChange={() =>
                                toggleExerciseComplete(
                                  weekIndex,
                                  dayIndex,
                                  exerciseIndex
                                )
                              }
                              className="h-4 w-4"
                              disabled={day.completed || isLoading}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );
};

export default Progress;

