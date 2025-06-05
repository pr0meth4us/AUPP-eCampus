// components/Modals/EnrollStudentModal.jsx

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

const EnrollStudentModal = ({ isOpen, onClose, studentId, setStudentId, onEnroll }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Enroll Student</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Student ID or Email"
                value={studentId}
                onValueChange={setStudentId}
                placeholder="Enter student ID or email"
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
                  onEnroll();
                  onCloseModal();
                }}
              >
                Enroll Student
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EnrollStudentModal;
