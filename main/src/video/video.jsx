import ReactPlayer from 'react-player';
import BackGround from "../BackGround/BackGroundJsx/BackGround.jsx";
import "../BackGround/BackGroundCss/BackGround.css";
import "./video.css";
import UserIcon from "../images/User.png";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Video({ user }) {
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoIDs, setVideoIDs] = useState([]);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [randomUrl, setRandomUrl] = useState('');
    const [new_comment, setNewComment] = useState(false);

    function getRandomElement(arr) {
        if (arr.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    const CommentCard = ({ userName, text}) => {
        return (
          <div className="comment-card">
            <img src={UserIcon} alt="User" className="comment-card__image" />
            <div className="comment-card__content">
              <p className="comment-card__username">{userName}</p>
              <p className="comment-card__text">{text}</p>
            </div>
          </div>
        );
      };

    function VideoCard(props) {
        const [isPlaying, setIsPlaying] = useState(false);
        if (props.id === null) return null;

        const handleClick = () => {
            setRandomUrl(props.id);
        };

        return (
            <div className='videoCard'
                onClick={handleClick}
                onMouseEnter={() => setIsPlaying(true)}
                onMouseLeave={() => setIsPlaying(false)}>
                <div className='Preview'>
                    <button className='Card'>
                        <ReactPlayer
                            url={`http://localhost:8000/upload/${props.id}/`}
                            width="100%"
                            height="100%"
                            playing={isPlaying}
                            loop={true}
                            muted={true}
                        />
                    </button>
                </div>
                <div className='Text'>
                    <p>{props.text}</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (randomUrl) {
            axios.get(`http://localhost:8000/comments/${randomUrl}/`)
                .then((response) => {
                    setComments(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching comments:", error);
                });
        }
    }, [randomUrl, new_comment]);

    useEffect(() => {
        axios.get('http://localhost:8000/id/')
            .then(response => {
                setVideoIDs(response.data);
                const initialRandomUrl = response.data.length > 0 ? getRandomElement(response.data)[0] : '';
                setRandomUrl(initialRandomUrl);
            })
            .catch(error => {
                console.error("Error fetching video IDs:", error);
            });
    }, []);

    function SendComment() {
        axios.post(`http://localhost:8000/comments/${randomUrl}/`, {
            comment,
            user
        })
            .then(() => {
                setComment('');
                setNewComment(!new_comment);
            })
            .catch(error => {
                console.log('Error sending comment:', error);
                setComment('');
            });
    }

    const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!videoFile) {
            console.error("No video file selected");
            return;
        }

        const formData = new FormData();
        formData.append('video_name', title);
        formData.append('video_file', videoFile);

        try {
            const response = await axios.post('http://localhost:8000/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Video uploaded successfully:', response.data);
            window.location.reload();
            // После успешной загрузки можно выполнить дополнительные действия, например, обновить список видео
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    return (
        <div>
            <BackGround />

            <div className='Main'>
                <div className='left-col'>
                    <div className='player-wrapper'>
                        <div className='react-player'>
                            {randomUrl && (
                                <ReactPlayer
                                    url={`http://localhost:8000/upload/${randomUrl}`}
                                    controls
                                    width="100%"
                                    height="100%"
                                />
                            )}
                        </div>
                    </div>

                    <div className='CommnetInput'>
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Ваш комментарий'
                        />
                        <button
                            className='SendComment'
                            onClick={SendComment}
                            disabled={!comment.trim()}>
                            Send comment
                        </button>
                    </div>

                    <h3>Comments:</h3>
                    <ul>
                        {comments.length === 0 ? <p> Пока комментариев нет </p> :
                            comments.map(comment => (
                                <CommentCard
                                    key={comment.id} // Добавляем уникальный ключ
                                    userName={comment.username}
                                    text={comment.text}
                                />
                            ))}
                    </ul>
                </div>

                <div className='right-col'>
                    <div className='player-wrapper'>
                        <div className='react-player'>
                            <div className='videoList'>
                                {videoIDs.map(id => (
                                    <VideoCard
                                        key={id[0]}
                                        id={id[0] !== randomUrl ? id[0] : null}
                                        text={id[1]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Video Title"
                    required
                />
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange} // Изменяем на handleFileChange
                    required
                />
                <button type="submit">Upload Video</button>
            </form>
        </div>
    );
}
