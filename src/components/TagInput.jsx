import React from "react";
import { useFieldArray } from "react-hook-form";

function TagInput({
  control,
  name = "tags",
  maxTags = 5,
  placeholder = "Add a tag (press Enter)",
  error,
  onError,
}) {
  const {fields, append, remove} = useFieldArray({
    control,
    name,
  });
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        if (fields.length < maxTags) {
          append(value);
          e.target.value = "";
        } else {
          if (onError) onError(`Maximum ${maxTags} tags allowed`);
        }
      }
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div>
        {fields.map((field, index) => (
          <span key={field.id}>
            {field.value}
            <button type="button" onClick={() => remove(index)}>
              &times;
            </button>
          </span>
        ))}
        {error && <span>{error}</span>}
      </div>
    </div>
  );
}

export default TagInput;

