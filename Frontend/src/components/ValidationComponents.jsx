// Enhanced form validation utility for better user experience
import React from "react";

// Validation feedback component for form fields
export const ValidationFeedback = ({ touched, error, success }) => {
  if (!touched) return null;

  if (error) {
    return (
      <div className="flex items-center mt-1">
        <svg
          className="w-4 h-4 text-red-500 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-red-500 text-xs italic">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center mt-1">
        <svg
          className="w-4 h-4 text-green-500 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-green-500 text-xs italic">{success}</p>
      </div>
    );
  }

  return null;
};

// Enhanced input field with validation styling
export const ValidatedInput = ({
  label,
  name,
  type = "text",
  placeholder = "",
  formik,
  required = false,
  className = "",
  ...props
}) => {
  const hasError = formik.touched[name] && formik.errors[name];
  const hasSuccess =
    formik.touched[name] && !formik.errors[name] && formik.values[name];

  const inputClasses = `
    appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-1 leading-tight 
    focus:outline-none transition-colors duration-200 
    ${
      hasError
        ? "border-red-500 bg-red-50 focus:border-red-600 focus:bg-red-50"
        : hasSuccess
        ? "border-green-500 bg-green-50 focus:border-green-600 focus:bg-white"
        : "border-gray-200 bg-gray-200 focus:bg-white focus:border-gray-500"
    } 
    ${className}
  `;

  return (
    <div className="mb-4">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        className={inputClasses}
        {...props}
      />
      <ValidationFeedback
        touched={formik.touched[name]}
        error={formik.errors[name]}
        success={hasSuccess ? "Valid" : null}
      />
    </div>
  );
};

// Enhanced textarea field with validation styling
export const ValidatedTextarea = ({
  label,
  name,
  placeholder = "",
  formik,
  required = false,
  rows = 4,
  maxLength,
  className = "",
  ...props
}) => {
  const hasError = formik.touched[name] && formik.errors[name];
  const hasSuccess =
    formik.touched[name] && !formik.errors[name] && formik.values[name];
  const currentLength = formik.values[name]?.length || 0;

  const textareaClasses = `
    block w-full text-gray-700 border rounded py-3 px-4 mb-1 leading-tight 
    focus:outline-none transition-colors duration-200 resize-vertical
    ${
      hasError
        ? "border-red-500 bg-red-50 focus:border-red-600 focus:bg-red-50"
        : hasSuccess
        ? "border-green-500 bg-green-50 focus:border-green-600 focus:bg-white"
        : "border-gray-200 bg-gray-200 focus:bg-white focus:border-gray-500"
    } 
    ${className}
  `;

  return (
    <div className="mb-4">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        {...props}
      />
      <div className="flex justify-between items-start">
        <ValidationFeedback
          touched={formik.touched[name]}
          error={formik.errors[name]}
          success={hasSuccess ? "Valid" : null}
        />
        {maxLength && (
          <span
            className={`text-xs ${
              currentLength > maxLength * 0.9
                ? "text-orange-500"
                : "text-gray-500"
            }`}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// Enhanced select field with validation styling
export const ValidatedSelect = ({
  label,
  name,
  options = [],
  formik,
  required = false,
  className = "",
  ...props
}) => {
  const hasError = formik.touched[name] && formik.errors[name];
  const hasSuccess =
    formik.touched[name] && !formik.errors[name] && formik.values[name];

  const selectClasses = `
    block w-full text-gray-700 border rounded py-3 px-4 mb-1 leading-tight 
    focus:outline-none transition-colors duration-200
    ${
      hasError
        ? "border-red-500 bg-red-50 focus:border-red-600 focus:bg-red-50"
        : hasSuccess
        ? "border-green-500 bg-green-50 focus:border-green-600 focus:bg-white"
        : "border-gray-200 bg-gray-200 focus:bg-white focus:border-gray-500"
    } 
    ${className}
  `;

  return (
    <div className="mb-4">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        className={selectClasses}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ValidationFeedback
        touched={formik.touched[name]}
        error={formik.errors[name]}
        success={hasSuccess ? "Valid" : null}
      />
    </div>
  );
};

export default {
  ValidationFeedback,
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
};
