// components/ModulesSection.jsx

import React from "react";
import { Card, CardHeader, CardBody, Button, Tooltip } from "@nextui-org/react";
import { PlusIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const ModulesSection = ({ modules, onAddModule, onDeleteModule }) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Modules ({modules.length})</h3>
        <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />} onPress={onAddModule}>
          Add Module
        </Button>
      </CardHeader>
      <CardBody>
        {modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module, idx) => (
              <Card key={module._id} className="border shadow-sm">
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">
                      Module {idx + 1}: {module.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                  <Tooltip content="Delete Module" color="danger">
                    <Button
                      color="danger"
                      variant="light"
                      size="sm"
                      isIconOnly
                      onPress={() => onDeleteModule(module._id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </Tooltip>
                </CardHeader>
                {module.contents && module.contents.length > 0 && (
                  <CardBody className="pt-0">
                    <h5 className="font-medium text-sm text-gray-700 mb-2">Contents:</h5>
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {module.contents.map((content) => (
                        <div
                          key={content._id}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-2">
                            <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {content.title} ({content.content_type})
                            </span>
                          </div>
                          {/* If you need to delete content inside a module, add a handler here */}
                        </div>
                      ))}
                    </div>
                  </CardBody>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No modules created yet.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default ModulesSection;
