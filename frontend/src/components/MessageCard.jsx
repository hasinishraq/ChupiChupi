import React from "react";

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const MessageCard = ({ message, onMarkRead, onDelete }) => {
  return (
    <article className={`message-card ${message.isRead ? "read" : "unread"}`}>
      <header className="message-header">
        <span className="message-status">{message.isRead ? "Read" : "New"}</span>
        <time className="message-date">{formatDate(message.createdAt)}</time>
      </header>
      <p className="message-content">{message.content}</p>
      <div className="message-actions">
        {!message.isRead && (
          <button className="chip" type="button" onClick={() => onMarkRead(message.id)}>
            Mark read
          </button>
        )}
        <button className="chip danger" type="button" onClick={() => onDelete(message.id)}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default MessageCard;
