import React from "react";
import { useFieldArray } from "react-hook-form";

import styles from "./TagInput.module.css";

function TagInput({
  control,
  name = "tags",
  maxTags = 5,
  placeholder = "Add a tag (press Enter)",
  error,
  onError,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim().toLowerCase();
      if (value) {
        if (fields.some((field) => field.value === value)) {
          onError("Tag already exists");
          return;
        } else if (fields.length < maxTags) {
          append({ value });
          e.target.value = "";
        } else {
          onError(`Maximum ${maxTags} tags allowed`);
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.tags}>
        {fields.map((field, index) => (
          <span key={field.id} className={styles.tag}>
            #{field.value}
            <button
              type="button"
              onClick={() => remove(index)}
              className={styles.removebtn}
            >
              &times;
            </button>
          </span>
        ))}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}

export default TagInput;

