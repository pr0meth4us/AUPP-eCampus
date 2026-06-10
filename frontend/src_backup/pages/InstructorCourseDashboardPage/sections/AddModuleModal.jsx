// components/Modals/AddModuleModal.jsx

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@heroui/react";

const AddModuleModal = ({
  isOpen,
  onClose,
  newTitle,
  setNewTitle,
  newDesc,
  setNewDesc,
  onAdd,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add New Module</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Module Title"
                value={newTitle}
                onValueChange={setNewTitle}
                placeholder="Enter module title"
                variant="bordered"
              />
              <Textarea
                label="Module Description"
                value={newDesc}
                onValueChange={setNewDesc}
                placeholder="Enter module description"
                variant="bordered"
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
                Add Module
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddModuleModal;
