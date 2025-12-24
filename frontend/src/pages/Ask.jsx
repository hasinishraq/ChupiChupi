import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipient, sendMessage } from "../api/message.api";

const QUICK_PICKS = [
  "Who is your secret crush? 😳",
  "Tell me a wild truth 👀",
  "Any advice for me? ✨",
  "What's your honest first impression? 😅",
];

const Ask = () => {
  const { shareToken } = useParams();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState("");

  if (!shareToken) {
    return (
      <section className="page">
        <div className="card">
          <h1>Missing link</h1>
          <p className="muted">This inbox link is not valid.</p>
        </div>
      </section>
    );
  }

  useEffect(() => {
    let ignore = false;

    const fetchRecipient = async () => {
      try {
        const result = await getRecipient(shareToken);
        if (!ignore) {
          setRecipientName(result?.username || "");
        }
      } catch (error) {
        if (!ignore) {
          setRecipientName("");
        }
      }
    };

    fetchRecipient();

    return () => {
      ignore = true;
    };
  }, [shareToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });
    setLoading(true);

    try {
      await sendMessage({ shareToken, content: content.trim() });
      setContent("");
      setStatus({
        type: "success",
        message: "Sent. Your message is on its way.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page ask-page">
      <div className="card wide">
        <div className="card-header">
          <h1>Anonymous inbox</h1>
          {recipientName && <p className="recipient-name">for {recipientName}</p>}
          <p className="muted">
            Your message stays anonymous. Be kind and keep it honest.
          </p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="quick-picks">
            <p className="quick-title">Quick picks</p>
            <div className="quick-list">
              {QUICK_PICKS.map((text) => (
                <button
                  key={text}
                  type="button"
                  className="chip quick"
                  onClick={() => setContent(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          <label className="field">
            <span>Your message</span>
            <textarea
              name="content"
              rows="5"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="👉 Ask something sweet, say what's on your mind 😊"
              maxLength={1000}
              required
            />
          </label>
          {status.message && (
            <p className={`form-feedback ${status.type}`}>{status.message}</p>
          )}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send anonymously"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Ask;
