import { useState , useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { countusers } from "../api/auth";

export default function Stats(){
    const [count,setcount] = useState(0);
   const userscount = async () => {
  try {
    const res = await countusers();
    setcount(parseInt(res.data.count));
    console.log(res.data.count)
  } catch (err) {
    console.log(err);
  }
  
};
    useEffect(() => {
        userscount();
    },[])
    return (
        <>
        <div className="pt-7 flex items-center justify-center gap-[170px]">
            <div className="bg-blue-500 text-white p-6 rounded-lg">Total Users <br />
               <span className="ml-9">{count ?? 0}</span>
            </div>
             <div className="bg-blue-500 text-white p-6 rounded-lg">Total Books <br />
                  <span className="ml-9">0</span>
             </div>
             <div className="bg-blue-500 text-white p-6 rounded-lg">Total Emprunts <br />
                  <span className="ml-9">0</span>
             </div>
        </div>
        </>
    )
}