import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers : async()=>{
        set({isUsersLoading: true});
        try{
            const response = await axiosInstance.get('/message/users');
            set({users: response.data});
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userID) => {
        set({ isMessagesLoading: true });
        try {
          const response = await axiosInstance.get(`/message/${userID}`);
          set({ messages: response.data });
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
          set({ isMessagesLoading: false });
        }
      },

    sendMessage : async(messageData)=>{
        const {selectedUser,messages} = get();
        try{
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages: [...messages,response.data]});
        }catch(error){
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderID === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages,newMessage],
            })
        })
    },

    unsubscribeFromMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser)=>{
        set({selectedUser});
    },
}))