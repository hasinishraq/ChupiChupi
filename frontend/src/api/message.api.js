import { del, get, patch, post } from "./client";

const getRecipient = (shareToken) => get(`/messages/${shareToken}`);

const sendMessage = ({ shareToken, content }) =>
  post(`/messages/${shareToken}`, { content });

const listMessages = ({ page = 1, limit = 20 } = {}) =>
  get(`/messages?page=${page}&limit=${limit}`);

const markRead = (id) => patch(`/messages/${id}/read`, {});

const deleteMessage = (id) => del(`/messages/${id}`);

export { getRecipient, sendMessage, listMessages, markRead, deleteMessage };
