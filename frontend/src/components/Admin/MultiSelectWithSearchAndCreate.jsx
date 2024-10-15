import React, { useState } from 'react';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';

const MultiSelectWithSearchAndCreate = ({ options, selectedOptions, onChange, allowAdd }) => {
    const [inputValue, setInputValue] = useState('');
    const [customOptions, setCustomOptions] = useState(options);
    console.log(options,"pipui")

    const handleChange = (selected) => {
        onChange(selected.map(option => option.name));
    };

    const handleCreate = () => {
        if (inputValue && !customOptions.find(option => option.name === inputValue)) {
            const newOption = { name: inputValue };
            setCustomOptions(prev => [...prev, newOption]);
            handleChange([...selectedOptions, newOption]);
            setInputValue('');
        }
    };

    const formattedOptions = customOptions.map(option => ({
        name: option.name,
    }));

    return (
        <div className="mb-3">
            <Select
                isMulti
                options={formattedOptions}
                value={formattedOptions.filter(option => selectedOptions.includes(option.name))}
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
