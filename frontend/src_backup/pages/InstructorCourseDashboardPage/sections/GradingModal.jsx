import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";

const GradingModal = ({
                        isOpen,
                        onClose,
                        studentName,
                        gradeInput,
                        setGradeInput,
                        feedbackInput,
                        setFeedbackInput,
                        onSubmit,
                      }) => {
  return (
      <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          {(onCloseGrading) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Grade Submission: {studentName}
                </ModalHeader>
                <ModalBody>
                  <Input
                      label="Grade"
                      type="number"
                      placeholder="Enter grade (e.g., 85)"
                      value={gradeInput}
                      onValueChange={setGradeInput}
                      autoFocus
                      variant="bordered"
                  />
                  <Textarea
                      label="Feedback"
                      placeholder="Provide feedback to the student"
                      value={feedbackInput}
                      onValueChange={setFeedbackInput}
                      minRows={4}
                      variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onCloseGrading}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={onSubmit}>
                    Submit Grade
                  </Button>
                </ModalFooter>
              </>
          )}
        </ModalContent>
      </Modal>
  );
};

export default GradingModal;
