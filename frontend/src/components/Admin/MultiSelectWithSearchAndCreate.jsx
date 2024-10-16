import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';  // Use CreatableSelect for creating new options

const MultiSelectWithSearchAndCreate = ({ options, selectedOptions, onChange, allowAdd }) => {
    const [customOptions, setCustomOptions] = useState(options);

    // Handle option change
    const handleChange = (selected) => {
        onChange(selected ? selected.map(option => option.value) : []);
    };

    // Handle creating a new option and auto-select it
    const handleCreateOption = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setCustomOptions(prev => [...prev, newOption]);  // Add the new option to the list
        handleChange([...formattedOptions.filter(option => selectedOptions.includes(option.value)), newOption]); // Auto-select new option
    };

    // Format the options for react-select
    const formattedOptions = customOptions.map(option => ({
        value: option.value || option.name,  // Ensure 'value' is used correctly
        label: option.label || option.name,  // Ensure 'label' is used correctly
    }));

    return (
        <div className="mb-3">
            <CreatableSelect
                isMulti
                options={formattedOptions}
                value={formattedOptions.filter(option => selectedOptions.includes(option.value))}
                onChange={handleChange}
                placeholder="Select or add tags..."
                isClearable
                onCreateOption={allowAdd ? handleCreateOption : undefined}  // Enable option creation if allowed
                isValidNewOption={(inputValue) =>
                    inputValue && !customOptions.some(option => option.value === inputValue)
                }
            />
        </div>
    );
};

export default MultiSelectWithSearchAndCreate;
