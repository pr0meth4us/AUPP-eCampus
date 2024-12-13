import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { course } from "../services";
import { Card, CardBody, Textarea, Button } from "@nextui-org/react";
import { XCircle, FileText, Link as LinkIcon } from 'lucide-react';

export const MaterialDetailPage = () => {
    const { courseId, moduleId, materialId } = useParams();
    const [material, setMaterial] = useState(null);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const fetchedMaterial = await course.getMaterialById(courseId, moduleId, materialId);
                setMaterial(fetchedMaterial);
            } catch (error) {
                console.error("Failed to fetch material:", error);
                setMaterial(null);
            }
        };
        fetchMaterial();
    }, [courseId, moduleId, materialId]);

    if (!material) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <XCircle className="mx-auto mb-4 text-gray-400" size={64} />
                <h1 className="text-2xl font-bold text-gray-600">Material Not Found</h1>
                <Button color="primary" variant="flat" className="mt-4">
                    Back to Module
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardBody className="space-y-6">
                    <h1 className="text-2xl font-bold">{material.title}</h1>
                    <p className="text-gray-600">{material.description}</p>
                    {material.content_url.startsWith('http') ? (
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<LinkIcon size={16} />}
                            onPress={() => window.open(material.content_url, '_blank')}
                        >
                            View File
                        </Button>
                    ) : (
                        <Textarea aria-label="Material content" value={material.content_url} readOnly minRows={4} fullWidth />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};
