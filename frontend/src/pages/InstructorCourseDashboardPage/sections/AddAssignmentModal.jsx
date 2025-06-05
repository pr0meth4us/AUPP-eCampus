// components/Modals/AddAssignmentModal.jsx

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@nextui-org/react";

const AddAssignmentModal = ({
  isOpen,
  onClose,
  newTitle,
  setNewTitle,
  newDesc,
  setNewDesc,
  newType,
  setNewType,
  newPoints,
  setNewPoints,
  newDueDate,
  setNewDueDate,
  onAdd,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center" scrollBehavior="inside">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create New Assignment</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Assignment Title"
                value={newTitle}
                onValueChange={setNewTitle}
                placeholder="Enter assignment title"
                variant="bordered"
              />
              <Textarea
                label="Assignment Description"
                value={newDesc}
                onValueChange={setNewDesc}
                placeholder="Enter assignment description"
                variant="bordered"
              />

              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <select
                  className="border p-2 rounded w-full sm:w-auto"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="text">Text Response</option>
                  <option value="file_upload">File Upload</option>
                  <option value="quiz">Quiz (External/Link)</option>
                  <option value="project">Project</option>
                </select>
                <Input
                  label="Points"
                  type="number"
                  value={newPoints}
                  onValueChange={setNewPoints}
                  placeholder="100"
                  variant="bordered"
                  className="w-full sm:w-1/3"
                />
              </div>

              <Input
                label="Due Date (Optional)"
                type="datetime-local"
                value={newDueDate}
                onValueChange={setNewDueDate}
                variant="bordered"
                className="mt-3"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseModal}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onAdd();
                  onCloseModal();
                }}
              >
                Create Assignment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddAssignmentModal;
