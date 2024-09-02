import {create} from 'zustand';
import axios from 'axios';

const API_URL='http://localhost:5000';
interface SpaService{
    id:number;
    name:string;
    description:string;
    price:number
}

interface SpaServiceStore{
    spaServices:SpaService[];
    spaService:SpaService | null;
    fetchSpaServices:()=>Promise<void>;
    fetchSpaServiceById:(serviceId:number)=>Promise<void>;

}

const useSpaServiceStore=create<SpaService>((set)=>({
    spaServices:[],
    spaService:null,

    fetchSpaServices:async ()=>{
        try{
            const token=sessionStorage.getItem('token')?? '';
            const response=await axios.get<SpaService>(`${API_URL}/spa-service`,{
             headers:{
                Authorization:`Bearer ${token}`,
             }, 
            }),
            set({spaServices:response.data});
        } catch(error){
            console.log('Error fetching bookings:',error);
        }
    },

    fetchSpaServiceById:async (serviceId:number)=>{
        try{
            const toekn=sessionStorage.getItem('token')?? '';
            const response=await axios.get<SpaService>(`${API_URL}/spa-service`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            set((state)=>({
                spaService:response.data,
            }));
            return response.data;
        }catch(error){
            console.error('Error fetching service by id:',error);
            return undefined;
        }
    },

    
}))