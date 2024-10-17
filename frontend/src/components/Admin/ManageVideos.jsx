import { Accordion, Button, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { fetchAllVideos, deleteVideo as apiDeleteVideo } from "../../services/api";

const ManageVideos = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideosContent = async () => {
            const videoData = await fetchAllVideos();
            setVideos(videoData);
        };

        fetchVideosContent();
    }, []);

    const handleDeleteVideo = async (public_id) => {
        await apiDeleteVideo(public_id);
        setVideos((prevVideos) => prevVideos.filter(video => video.public_id !== public_id));
    };

    return (
        <Accordion className="mb-4">
            <Accordion.Item eventKey="1">
                <Accordion.Header>Manage Video</Accordion.Header>
                <Accordion.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Public ID</th>
                            <th>Thumbnail</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {videos.map((video) => (
                            <tr key={video.public_id}>
                                <td>{video.url}</td>
                                <td>{video.public_id}</td>
                                <td>
                                    <img src={video.thumbnail_url} alt="thumbnail" />
                                </td>
                                <td>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => handleDeleteVideo(video.public_id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default ManageVideos;
