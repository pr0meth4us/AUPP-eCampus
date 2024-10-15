import React, { useState } from 'react';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';

const MultiSelectWithSearchAndCreate = ({ options, selectedOptions, onChange, allowAdd }) => {
    const [inputValue, setInputValue] = useState('');
    const [customOptions, setCustomOptions] = useState(options);

    const handleChange = (selected) => {
        onChange(selected.map(option => option.value));
    };

    const handleCreate = () => {
        if (inputValue && !customOptions.find(option => option.value === inputValue)) {
            const newOption = { value: inputValue, label: inputValue };
            setCustomOptions(prev => [...prev, newOption]);
            handleChange([...selectedOptions, newOption]);
            setInputValue('');
        }
    };

    const formattedOptions = customOptions.map(option => ({
        value: option.value,
        label: option.label,
    }));

    return (
        <div className="mb-3">
            <Select
                isMulti
                options={formattedOptions}
                value={formattedOptions.filter(option => selectedOptions.includes(option.value))}
                onChange={handleChange}
                onInputChange={(newValue) => setInputValue(newValue)}
                placeholder="Select or add tags..."
                isClearable
            />
            {allowAdd && (
                <div className="d-flex mt-2">
                    <Form.Control
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add new tag"
                        className="me-2"
                    />
                    <Button variant="primary" onClick={handleCreate}>Add</Button>
                </div>
            )}
        </div>
    );
};

export default MultiSelectWithSearchAndCreate;
