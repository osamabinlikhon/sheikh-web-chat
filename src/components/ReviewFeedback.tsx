import React, { useState } from 'react';
import { Space, Button, Tooltip, message, Popover, Input } from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  CopyOutlined,
  CheckOutlined,
  MessageOutlined
} from '@ant-design/icons';
import type { FeedbackData } from '../types';

interface ReviewFeedbackProps {
  messageId: string;
  onFeedback: (feedback: FeedbackData) => void;
}

const ReviewFeedback: React.FC<ReviewFeedbackProps> = ({ messageId, onFeedback }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setLiked(true);
    setDisliked(false);
    onFeedback({ messageId, type: 'like' });
    message.success('Thanks for your feedback!');
  };

  const handleDislike = () => {
    setDisliked(true);
    setLiked(false);
    onFeedback({ messageId, type: 'dislike', comment });
    if (comment) {
      message.info("We'll improve based on your detailed feedback.");
    } else {
      message.info("We'll improve based on your feedback.");
    }
    setComment('');
  };

  const handleCopy = async () => {
    try {
      // Find the closest bubble content
      const bubble = document.querySelector(`[data-message-id="${messageId}"]`);
      const text = bubble?.textContent || '';
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      message.success('Copied to clipboard!');
      onFeedback({ messageId, type: 'copy' });
    } catch (err) {
      message.error('Failed to copy');
    }
  };

  const commentContent = (
    <div style={{ padding: '8px' }}>
      <Input.TextArea
        placeholder="What could be improved?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <Button
        type="primary"
        size="small"
        onClick={handleDislike}
        style={{ marginTop: '8px' }}
      >
        Submit Feedback
      </Button>
    </div>
  );

  return (
    <Space style={{ marginTop: '8px', justifyContent: 'flex-end', width: '100%' }}>
      <Tooltip title="Helpful review">
        <Button
          type={liked ? 'primary' : 'text'}
          icon={<LikeOutlined />}
          size="small"
          onClick={handleLike}
        />
      </Tooltip>

      <Popover content={commentContent} title="Provide Feedback" trigger="click">
        <Tooltip title="Needs improvement">
          <Button
            type={disliked ? 'primary' : 'text'}
            icon={<DislikeOutlined />}
            size="small"
          />
        </Tooltip>
      </Popover>

      <Tooltip title="Copy review">
        <Button
          type={copied ? 'primary' : 'text'}
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          size="small"
          onClick={handleCopy}
        />
      </Tooltip>

      <Tooltip title="Add comment">
        <Button
          type="text"
          icon={<MessageOutlined />}
          size="small"
        />
      </Tooltip>
    </Space>
  );
};

export default ReviewFeedback;
