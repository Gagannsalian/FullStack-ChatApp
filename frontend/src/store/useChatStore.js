import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"; // Ensure Auth Store is imported

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ✅ Fetch Users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
        toast.error("No user selected!");
        return;
    }

    try {
        console.log("Sending message:", messageData); // Debugging

        const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData
        );

        console.log("Response from API:", res.data); // Debugging

        set({ messages: [...messages, res.data] });
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to send message");
    }
},


getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        console.log("Fetched Messages:", res.data); // Debugging

        if (Array.isArray(res.data)) {
            set({ messages: res.data });
        } else {
            console.warn("Unexpected API response:", res.data); // Debugging
            set({ messages: [] });
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
        set({ isMessagesLoading: false });
    }
},

  // ✅ Subscribe to Incoming Messages via Socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket is not initialized!");
      return;
    }

    console.log("Subscribing to messages for user:", selectedUser._id);

    // Unsubscribe first to prevent multiple listeners
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      console.log("Received new message:", newMessage);

      if (newMessage.senderId !== selectedUser._id) return;

      set((state) => ({ messages: [...state.messages, newMessage] }));
    });
  },

  // ✅ Unsubscribe from Messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    console.log("Unsubscribing from messages...");
    socket.off("newMessage");
  },

  // ✅ Set Selected User
  setSelectedUser: (selectedUser) => {
    console.log("User selected:", selectedUser);
    set({ selectedUser });
  },
}));
