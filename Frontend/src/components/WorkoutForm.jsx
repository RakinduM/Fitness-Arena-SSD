import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSnackbar } from "notistack";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  console.log(user.token);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(
          `http://localhost:6005/api/users/${user.email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        setUserId(data._id);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("An error occurred while fetching user data.");
      }
    };

    if (user) {
      fetchUserId();
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      title: "",
      load: "",
      reps: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .matches(
          /^[a-zA-Z0-9\s\-_]+$/,
          "Title can only contain letters, numbers, spaces, hyphens and underscores"
        )
        .min(1, "Exercise title must be at least 1 character")
        .max(100, "Exercise title must be less than 100 characters")
        .required("Exercise Title is required"),
      load: Yup.number()
        .min(0, "Load must be 0 or greater")
        .max(10000, "Load must be less than 10000")
        .required("Load is required")
        .positive("Load must be a positive number"),
      reps: Yup.number()
        .min(1, "Reps must be at least 1")
        .max(1000, "Reps must be less than 1000")
        .integer("Reps must be a whole number")
        .required("Reps are required")
        .positive("Reps must be a positive number"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!userId) {
        setError("User ID not found.");
        enqueueSnackbar(
          "Authentication error. Please log out and log in again.",
          {
            variant: "error",
            autoHideDuration: 4000,
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );
        setSubmitting(false);
        return;
      }

      const workout = { ...values, userId: userId };

      try {
        const response = await fetch("http://localhost:6005/api/workouts", {
          method: "POST",
          body: JSON.stringify(workout),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log(workout);

        const json = await response.json();

        if (!response.ok) {
          // Handle validation errors from backend
          if (response.status === 400 && json.errors) {
            json.errors.forEach((err) => {
              enqueueSnackbar(`${err.path}: ${err.msg}`, {
                variant: "error",
                autoHideDuration: 5000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
              });
            });
          } else if (json.message) {
            enqueueSnackbar(`Error: ${json.message}`, {
              variant: "error",
              autoHideDuration: 4000,
              anchorOrigin: { vertical: "top", horizontal: "right" },
            });
          } else {
            enqueueSnackbar(
              json.error || "Failed to add workout. Please try again.",
              {
                variant: "error",
                autoHideDuration: 4000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
              }
            );
          }
          setError(json.error);
        } else {
          resetForm();
          setError(null);
          dispatch({ type: "CREATE_WORKOUT", payload: json });
          enqueueSnackbar("Workout added successfully!", {
            variant: "success",
            autoHideDuration: 3000,
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        }
      } catch (error) {
        console.error("Error adding workout:", error);
        setError("An error occurred while adding the workout.");
        enqueueSnackbar(
          "Network error. Please check your connection and try again.",
          {
            variant: "error",
            autoHideDuration: 4000,
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );
      }

      setSubmitting(false);
    },
  });

  return (
    <form
      className="w-full max-w-s mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={formik.handleSubmit}
    >
      <h3 className="text-xl font-bold mb-6 text-center text-orange-500">
        Add a New Workout
      </h3>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="title"
        >
          Exercise Title:
        </label>
        <select
          id="title"
          name="title"
          onChange={(e) => {
            if (/^[a-zA-Z\s]*$/.test(e.target.value) || e.target.value === "") {
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className={`${
            formik.touched.title && formik.errors.title
              ? "border-red-500"
              : "border-gray-300"
          } appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          placeholder="Select Exercise Title"
        >
          <option value="">Select Exercise Title</option>
          <option value="Bench Press">Bench Press</option>
          <option value="Squats">Squats</option>
          <option value="Deadlifts">Deadlifts</option>
          <option value="Pull-Ups/Chin-Ups">Pull-Ups/Chin-Ups</option>
          <option value="Shoulder Press">Shoulder Press</option>
          <option value="Lunges">Lunges</option>
          <option value="Bicep Curls">Bicep Curls</option>
          <option value="Tricep Dips">Tricep Dips</option>
          <option value="Planks">Planks</option>
          <option value="Push-Ups">Push-Ups</option>
          <option value="Lat Pulldowns">Lat Pulldowns</option>
          <option value="Leg Press">Leg Press</option>
          <option value="Crunches">Crunches</option>
          <option value="Leg Raises">Leg Raises</option>
          <option value="Dumbbell Rows">Dumbbell Rows</option>
          <option value="Lateral Raises">Lateral Raises</option>
          <option value="Chest Fly">Chest Fly</option>
          <option value="Tricep Pushdowns">Tricep Pushdowns</option>
          <option value="Seated Cable Rows">Seated Cable Rows</option>
          <option value="Russian Twists">Russian Twists</option>
        </select>
        {formik.touched.title && formik.errors.title && (
          <p className="text-red-500 text-xs italic">{formik.errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="load"
        >
          Load (in kg):
        </label>
        <input
          type="number"
          id="load"
          name="load"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.load}
          className={`${
            formik.touched.load && formik.errors.load
              ? "border-red-500"
              : "border-gray-300"
          } appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          placeholder="Enter Load (in kg)"
        />
        {formik.touched.load && formik.errors.load && (
          <p className="text-red-500 text-xs italic">{formik.errors.load}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="reps"
        >
          Reps:
        </label>
        <input
          type="number"
          id="reps"
          name="reps"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.reps}
          className={`${
            formik.touched.reps && formik.errors.reps
              ? "border-red-500"
              : "border-gray-300"
          } appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          placeholder="Enter Reps"
        />
        {formik.touched.reps && formik.errors.reps && (
          <p className="text-red-500 text-xs italic">{formik.errors.reps}</p>
        )}
      </div>

      <center>
        <button
          type="submit"
          className="btn-sm bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Adding..." : "Add Workout"}
        </button>
      </center>

      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </form>
  );
};

export default WorkoutForm;
