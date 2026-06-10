// components/CourseHeader.jsx

import React from "react";
import { Card, CardBody, Input, Button, Chip, Image, Avatar } from "@heroui/react";
import { CheckCircleIcon, ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import {UploadIcon} from "lucide-react";

const CourseHeader = ({
                        course,
                        editing,
                        updatedTitle,
                        updatedDescription,
                        newCoverImage,
                        setNewCoverImage,
                        setUpdatedTitle,
                        setUpdatedDescription,
                        onSave,
                        onCancel,
                        onEdit,
                        onPublish
                      }) => {
  return (
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">

            {/* left side: cover, title, status, instructor */}
            <div className="flex items-center space-x-4">
              {editing ? (
                  <div
                      className="w-24 h-24 bg-white/20 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                    <label htmlFor="cover-image-upload" className="cursor-pointer text-xs mb-1 hover:text-blue-200">
                      <UploadIcon className="w-6 h-6 mx-auto mb-1"/> Change Cover
                    </label>
                    <input
                        id="cover-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewCoverImage(e.target.files[0])}
                        className="hidden"
                    />
                    {newCoverImage && (
                        <span className="text-xs mt-1 truncate w-full block">{newCoverImage.name}</span>
                    )}
                    {!newCoverImage && course.cover_image_url && (
                        <Image
                            src={course.cover_image_url}
                            alt="Current Cover"
                            className="w-10 h-10 mt-1 rounded object-cover mx-auto"
                        />
                    )}
                    {!newCoverImage && !course.cover_image_url && (
                        <div className="w-8 h-8 bg-white/30 rounded"/>
                    )}
                  </div>
              ) : course.cover_image_url ? (
                  <Image
                      src={course.cover_image_url}
                      alt="Course cover"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-md"
                  />
              ) : (
                  <div
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-xl flex items-center justify-center shadow-md">
                    <div className="w-10 h-10 bg-white/30 rounded"/>
                  </div>
              )}

              {/* title + status + instructor info */}
              <div>
                {editing ? (
                    <Input
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        classNames={{
                          inputWrapper: "bg-transparent",
                          input: "text-white placeholder:text-gray-300 text-2xl sm:text-3xl font-bold"
                        }}
                        variant="underlined"
                        placeholder="Course Title"
                    />
                ) : (
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                      {course.title}
                    </h1>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                  <Chip
                      color={course.is_published ? "success" : "warning"}
                      variant="flat"
                      size="sm"
                      startContent={
                        course.is_published ? (
                            <CheckCircleIcon className="w-4 h-4"/>
                        ) : (
                            <ClockIcon className="w-4 h-4"/>
                        )
                      }
                  >
                    {course.is_published ? "Published" : "Draft"}
                  </Chip>

                  <div className="flex items-center space-x-2">
                    <Avatar
                        size="sm"
                        src={course.instructor.profile_image || undefined}
                        name={course.instructor.name}
                    />
                    <span className="text-sm text-white/80">{course.instructor.name}</span>
                    <span className="text-sm text-white/70">({course.instructor.email})</span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-white/80">
                    <span>{course.enrolled_students?.length || 0} Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* right side: Edit / Save / Cancel / Publish buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button
                  color={editing ? "success" : "secondary"}
                  variant="flat"
                  onClick={editing ? onSave : onEdit}
                  startContent={editing ? <CheckCircleIcon className="w-4 h-4"/> : <PencilIcon className="w-4 h-4"/>}
                  className="w-full sm:w-auto"
              >
                {editing ? "Save Changes" : "Edit Details"}
              </Button>

              {editing && (
                  <Button
                      color="default"
                      variant="light"
                      onClick={onCancel}
                      className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
              )}

              <Button
                  color={course.is_published ? "warning" : "success"}
                  variant="solid"
                  onClick={onPublish}
                  className="w-full sm:w-auto"
              >
                {course.is_published ? "Unpublish" : "Publish Course"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
  );
};

export default CourseHeader;
