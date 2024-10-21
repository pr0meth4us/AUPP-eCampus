import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const MultiSelectWithSearchAndCreate = ({ initialOptions, currentSelections, onChange, allowAdd }) => {
    const [availableOptions, setAvailableOptions] = useState(initialOptions);

    const handleChange = (selected) => {
        onChange(selected ? selected.map(option => option.value) : []);
    };

    const handleCreateOption = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setAvailableOptions(prev => [...prev, newOption]);
        handleChange([...selectOptions.filter(option => currentSelections.includes(option.value)), newOption]); // Auto-select new option
    };

    const selectOptions = availableOptions.map(option => ({
        value: option.value || option.name,
        label: option.label || option.name,
    }));

    return (
        <div className="mb-3">
            <CreatableSelect
                isMulti
                options={selectOptions}
                value={selectOptions.filter(option => currentSelections.includes(option.value))}
                onChange={handleChange}
                placeholder="Select or add tags..."
                isClearable
                onCreateOption={allowAdd ? handleCreateOption : undefined}
                isValidNewOption={(inputValue) =>
                    inputValue && !availableOptions.some(option => option.value === inputValue)
                }
            />
        </div>
    );
};

export default MultiSelectWithSearchAndCreate;