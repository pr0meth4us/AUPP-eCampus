import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';  // Use CreatableSelect for creating new options

const MultiSelectWithSearchAndCreate = ({ options, selectedOptions, onChange, allowAdd }) => {
    const [customOptions, setCustomOptions] = useState(options);

    const handleChange = (selected) => {
        onChange(selected ? selected.map(option => option.value) : []);
    };

    const handleCreateOption = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setCustomOptions(prev => [...prev, newOption]);
        handleChange([...formattedOptions.filter(option => selectedOptions.includes(option.value)), newOption]); // Auto-select new option
    };

    const formattedOptions = customOptions.map(option => ({
        value: option.value || option.name,
        label: option.label || option.name,
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
                onCreateOption={allowAdd ? handleCreateOption : undefined}
                isValidNewOption={(inputValue) =>
                    inputValue && !customOptions.some(option => option.value === inputValue)
                }
            />
        </div>
    );
};

export default MultiSelectWithSearchAndCreate;
