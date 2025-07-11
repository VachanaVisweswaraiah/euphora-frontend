import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`${baseURL}/message/all/${selectedUser?._id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (selectedUser?._id) {
            fetchAllMessage();
        }
    }, [selectedUser]);
};

export default useGetAllMessage;
