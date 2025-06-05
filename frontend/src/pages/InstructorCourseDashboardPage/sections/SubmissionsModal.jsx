// components/SubmissionsModal.jsx

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner, Avatar, Chip } from "@nextui-org/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const SubmissionsModal = ({ isOpen, onClose, submissions, loading, onGradeClick }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside" placement="top-center">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Submissions</ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Spinner label="Loading submissions..." />
                </div>
              ) : submissions.length > 0 ? (
                <ul className="space-y-3">
                  {submissions.map((sub) => (
                    <li key={sub._id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar size="sm" name={sub.student_id} />
                            <p className="font-semibold text-md">Student: {sub.student_id}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(sub.submitted_at).toLocaleString()}
                          </p>

                          {sub.content && (
                            <p className="text-sm mt-2 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                              <strong>Response:</strong>
                              <br />
                              {sub.content}
                            </p>
                          )}

                          {sub.file_urls && sub.file_urls.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Files Submitted:</p>
                              <ul className="list-none pl-0 space-y-1 mt-1">
                                {sub.file_urls.map((url, idx) => (
                                  <li key={idx} className="text-sm flex items-center">
                                    <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-600 flex-shrink-0" />
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary-600 hover:underline truncate"
                                      title={sub.file_names[idx]}
                                    >
                                      {sub.file_names[idx] || `File ${idx + 1}`}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="mt-3 pt-2 border-t">
                            <p className="text-sm">
                              <strong>Grade:</strong>{" "}
                              {sub.grade != null ? (
                                sub.grade
                              ) : (
                                <Chip size="sm" color="warning" variant="flat">
                                  Not Graded
                                </Chip>
                              )}
                            </p>
                            <p className="text-sm mt-1">
                              <strong>Feedback:</strong>{" "}
                              {sub.feedback || <span className="text-gray-500 italic">No feedback yet</span>}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          color="secondary"
                          variant="flat"
                          onPress={() => onGradeClick(sub)}
                          className="mt-2 sm:mt-0"
                        >
                          {sub.grade != null ? "Edit Grade" : "Grade Submission"}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-8 text-gray-500">No submissions yet for this assignment.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SubmissionsModal;
