import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const MultiSelectWithSearchAndCreate = ({ options, selectedOptions, onChange, allowAdd }) => {
    console.log("selectedOptions", selectedOptions);
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

    const selectedNames = () => {
        return options
            .filter(option => selectedOptions.includes(option.id))
            .map(option => ({
                value: option.name,
                label: option.name
            }));
    };
    console.log(options, "options");
    console.log(selectedOptions, "selectedOptions");
    console.log(formattedOptions, "formattedOptions");

    console.log("kkk", selectedNames());


    return (
        <div className="mb-3">
            <CreatableSelect
                isMulti
                options={formattedOptions}
                value={selectedNames(formattedOptions)}
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
