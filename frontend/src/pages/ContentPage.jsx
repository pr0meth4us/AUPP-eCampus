import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { ArrowLeft, FileText, Video, Link, Download, Eye, ExternalLink, Play, File, Image, Music } from 'lucide-react';
import { course } from "../services";

export const ContentDetailPage = () => {
    const { courseId, moduleId, contentId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        fetchContent();
    }, [courseId, moduleId, contentId]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const moduleData = await course.getModuleById(courseId, moduleId);
            const foundContent = moduleData.contents.find(c => c._id === contentId);
            if (!foundContent) throw new Error("Content not found");
            setContent(foundContent);
            setModule(moduleData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToModule = () => {
        navigate(`/courses/${courseId}/modules/${moduleId}`);
    };

    const handleViewInNewTab = () => {
        if (content?.file_url) {
            window.open(content.file_url, '_blank');
        } else if (content?.content && content.content_type === 'link') {
            window.open(content.content, '_blank');
        }
    };

    const handleDownload = () => {
        if (content?.file_url) {
            const link = document.createElement('a');
            link.href = content.file_url;
            link.download = content.file_name || content.title || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getContentIcon = (contentType, fileType) => {
        switch (contentType) {
            case 'video':
                return <Video className="me-2" size={20} />;
            case 'file':
                if (fileType) {
                    const type = fileType.toLowerCase();
                    if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
                        return <Image className="me-2" size={20} />;
                    }
                    if (type.includes('audio') || ['mp3', 'wav', 'ogg'].includes(type)) {
                        return <Music className="me-2" size={20} />;
                    }
                    if (type === 'pdf') {
                        return <FileText className="me-2" size={20} />;
                    }
                }
                return <File className="me-2" size={20} />;
            case 'link':
                return <Link className="me-2" size={20} />;
            default:
                return <FileText className="me-2" size={20} />;
        }
    };

    const getContentTypeColor = (contentType) => {
        switch (contentType) {
            case 'video': return 'danger';
            case 'file': return 'primary';
            case 'link': return 'success';
            case 'text': return 'info';
            default: return 'secondary';
        }
    };

    const renderPreview = () => {
        if (!content) return null;

        switch (content.content_type) {
            case 'text':
                return (
                    <div className="content-preview">
                        <div className="preview-header d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">Text Content Preview</h6>
                            <Badge bg="info">Scrollable Preview</Badge>
                        </div>
                        <div
                            className="text-content p-3 border rounded bg-light"
                            style={{
                                height: '300px',
                                overflowY: 'auto',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                                {content.content}
                            </pre>
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="content-preview">
                        <div className="preview-header d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">Video Preview</h6>
                            <Badge bg="danger">Video Content</Badge>
                        </div>
                        <div
                            className="video-preview border rounded"
                            style={{ height: '300px', backgroundColor: '#f8f9fa' }}
                        >
                            {content.file_url ? (
                                <video
                                    className="w-100 h-100 rounded"
                                    style={{ objectFit: 'contain' }}
                                    poster={content.thumbnail_url}
                                >
                                    <source src={content.file_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                        <Play size={48} className="mb-3 text-muted" />
                                        <h6>Video Content</h6>
                                        <small className="text-muted">{content.file_name || 'Video file'}</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'file':
                const fileType = content.file_type?.toLowerCase();
                const isImage = fileType && (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType));
                const isPdf = fileType === 'pdf';

                return (
                    <div className="content-preview">
                        <div className="preview-header d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">
                                {isPdf ? 'PDF Document Preview' : isImage ? 'Image Preview' : 'File Preview'}
                            </h6>
                            <Badge bg="primary">
                                {content.file_type?.toUpperCase() || 'File'}
                            </Badge>
                        </div>

                        <div
                            className="file-preview border rounded"
                            style={{ height: '400px', backgroundColor: '#f8f9fa' }}
                        >
                            {isImage && content.file_url ? (
                                <div className="h-100 d-flex align-items-center justify-content-center p-3">
                                    <img
                                        src={content.file_url}
                                        alt={content.title}
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : isPdf && content.file_url ? (
                                <div className="h-100 position-relative">
                                    <iframe
                                        src={`${content.file_url}#toolbar=0&navpanes=0&scrollbar=1`}
                                        width="100%"
                                        height="100%"
                                        title={content.title}
                                        className="border-0 rounded"
                                        style={{ minHeight: '400px' }}
                                    />
                                    <div
                                        className="preview-overlay position-absolute top-0 start-0 w-100 p-2"
                                        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)' }}
                                    >
                                        <small className="text-muted bg-white px-2 py-1 rounded">
                                            📄 Scrollable PDF Preview
                                        </small>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                        {getContentIcon(content.content_type, content.file_type)}
                                        <h6 className="mt-2">{content.file_name}</h6>
                                        <Badge bg="secondary" className="mb-2">
                                            {content.file_type?.toUpperCase() || 'File'}
                                        </Badge>
                                        {content.file_size && (
                                            <div>
                                                <small className="text-muted">{content.file_size}</small>
                                            </div>
                                        )}
                                        <small className="text-muted d-block mt-2">
                                            Preview not available - Use "View Full Content" or "Open in New Tab"
                                        </small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'link':
                return (
                    <div className="content-preview">
                        <div className="preview-header d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">External Link Preview</h6>
                            <Badge bg="success">External Resource</Badge>
                        </div>
                        <div
                            className="link-preview border rounded p-4 bg-light"
                            style={{ height: '200px' }}
                        >
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="text-center">
                                    <ExternalLink size={48} className="text-success mb-3" />
                                    <h6>External Link</h6>
                                    <div className="mt-3 p-2 bg-white rounded border">
                                        <small className="text-muted text-break">
                                            {content.content}
                                        </small>
                                    </div>
                                    <small className="text-muted d-block mt-2">
                                        Click "Open in New Tab" to visit this link
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="content-preview">
                        <div className="preview-header d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">Content Preview</h6>
                            <Badge bg="secondary">Unknown Type</Badge>
                        </div>
                        <div
                            className="default-preview border rounded bg-light"
                            style={{ height: '200px' }}
                        >
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="text-center">
                                    <FileText size={48} className="text-muted mb-3" />
                                    <h6>Content Available</h6>
                                    <p className="text-muted mb-0">Use the action buttons below to view this content</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const renderFullContent = () => {
        if (!content) return null;

        switch (content.content_type) {
            case 'video':
                return (
                    <div className="content-video">
                        <video
                            controls
                            className="w-100 rounded"
                            style={{ maxHeight: '500px' }}
                        >
                            <source src={content.file_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );

            case 'file':
                if (content.file_type === 'pdf' && content.file_url) {
                    return (
                        <div className="pdf-viewer">
                            <iframe
                                src={content.file_url}
                                width="100%"
                                height="600px"
                                title={content.title}
                                className="border rounded"
                            />
                        </div>
                    );
                }
                return null;

            case 'text':
                return (
                    <div className="content-text">
                        <div className="p-4 bg-light rounded">
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                {content.content}
                            </pre>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const canShowFullView = () => {
        return content && (
            content.content_type === 'video' ||
            (content.content_type === 'file' && content.file_type === 'pdf') ||
            content.content_type === 'text'
        );
    };

    const canDownload = () => {
        return content && content.file_url && content.content_type !== 'link';
    };

    const canViewInNewTab = () => {
        return content && (content.file_url || (content.content_type === 'link' && content.content));
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={handleBackToModule}>
                        <ArrowLeft size={16} className="me-1" />
                        Back to Module
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleBackToModule}
                            className="me-3"
                        >
                            <ArrowLeft size={16} />
                        </Button>
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                                <h1 className="h3 mb-0 me-3">
                                    {getContentIcon(content?.content_type, content?.file_type)}
                                    {content?.title}
                                </h1>
                                <Badge bg={getContentTypeColor(content?.content_type)}>
                                    {content?.content_type?.toUpperCase()}
                                </Badge>
                            </div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none"
                                            onClick={() => navigate(`/courses/${courseId}`)}
                                        >
                                            Course
                                        </Button>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none"
                                            onClick={handleBackToModule}
                                        >
                                            {module?.title}
                                        </Button>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {content?.title}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mb-4">
                        {canShowFullView() && (
                            <Button
                                variant="primary"
                                onClick={() => setShowPreviewModal(true)}
                            >
                                <Eye size={16} className="me-1" />
                                View Full Content
                            </Button>
                        )}
                        {canViewInNewTab() && (
                            <Button
                                variant="outline-primary"
                                onClick={handleViewInNewTab}
                            >
                                <ExternalLink size={16} className="me-1" />
                                Open in New Tab
                            </Button>
                        )}
                        {canDownload() && (
                            <Button
                                variant="outline-success"
                                onClick={handleDownload}
                            >
                                <Download size={16} className="me-1" />
                                Download
                            </Button>
                        )}
                    </div>

                    {/* Content Preview */}
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Content Preview</h5>
                        </Card.Header>
                        <Card.Body>
                            {renderPreview()}

                            {content?.description && (
                                <div className="mt-4 pt-4 border-top">
                                    <h6 className="text-muted">Description</h6>
                                    <p className="mb-0">{content.description}</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Full Content Modal */}
            <Modal
                show={showPreviewModal}
                onHide={() => setShowPreviewModal(false)}
                size="xl"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {getContentIcon(content?.content_type, content?.file_type)}
                        {content?.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderFullContent()}
                </Modal.Body>
                <Modal.Footer>
                    {canViewInNewTab() && (
                        <Button variant="outline-primary" onClick={handleViewInNewTab}>
                            <ExternalLink size={16} className="me-1" />
                            Open in New Tab
                        </Button>
                    )}
                    {canDownload() && (
                        <Button variant="success" onClick={handleDownload}>
                            <Download size={16} className="me-1" />
                            Download
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};