import React, { useEffect, useState } from "react";
import { listMessages, markRead, deleteMessage } from "../api/message.api";
import MessageCard from "../components/MessageCard";
import { useAuth } from "../context/AuthContext";

const Inbox = () => {
  const { user, shareLink, regenerateShareToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle");

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listMessages({ page, limit });
      setMessages(result.items || []);
      setTotalPages(result.totalPages || 0);
    } catch (err) {
      setError(err.message || "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  useEffect(() => {
    if (copyStatus === "idle") {
      return undefined;
    }

    const timer = setTimeout(() => setCopyStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      await markRead(id);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch (err) {
      setError(err.message || "Could not update message.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((message) => message.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete message.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink);
      setError("");
      setCopyStatus("success");
    } catch (err) {
      setError("Copy failed. Try selecting and copying the link.");
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Regenerate your link? Old links will stop working.")) {
      return;
    }

    setActionLoading(true);
    try {
      await regenerateShareToken();
    } catch (err) {
      setError(err.message || "Could not regenerate link.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="page inbox-page">
      <div className="inbox-header">
        <div>
          <h1>{user?.username}'s inbox</h1>
          <p className="muted">
            Share your link, collect secret questions, no unnecessary drama 😉
          </p>
        </div>
        <div className="share-card">
          <p className="share-title">Your inbox link</p>
          <div className="share-row">
            <input type="text" readOnly value={shareLink || ""} />
            <button
              type="button"
              className={`chip ${copyStatus === "success" ? "success" : ""}`}
              onClick={handleCopy}
            >
              {copyStatus === "success" ? "Copied" : "Copy"}
            </button>
          </div>
          {copyStatus === "success" && (
            <p className="copy-feedback" role="status" aria-live="polite">
              Copied to clipboard
            </p>
          )}
          <div className="share-actions">
            <button type="button" className="chip" onClick={handleRegenerate}>
              Regenerate
            </button>
            {shareLink && (
              <a className="chip" href={shareLink} target="_blank" rel="noreferrer">
                Open
              </a>
            )}
          </div>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="message-grid">
        {loading ? (
          <div className="card">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="card empty">
            <h3>No messages yet</h3>
            <p className="muted">Share your link to start receiving questions.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="chip"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading || actionLoading}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="chip"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || loading || actionLoading}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Inbox;
