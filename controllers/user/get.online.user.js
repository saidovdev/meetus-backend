import User from "../../models/User.js";

 export const socketHandler=async(io)=>{
    io.on('connection',(socket)=>{
        console.log("Connecet",socket.id)
        socket.on('user-online',async(userId)=>{
            socket.join(userId.toString())
            await User.findByIdAndUpdate(userId,{
                isonline:true,
                lastSeen:null
            })

            const onlineUsers=Array.from(io.sockets.adapter.rooms.keys())
            io.emit('online-users',onlineUsers)
        })

        socket.on('disconnect',async()=>{
            const rooms=[...socket.rooms]
            const userRoom=rooms.find((r)=>r!==socket.id)
            if(userRoom){
                await User.findByIdAndUpdate(userRoom,{
                    isonline:false,
                    lastSeen:new Date()
                    
                })

                io.emit('online-users',Array.from(io.sockets.rooms.keys()))
            }
            console.log('discoonected',socket.id);
            
        })
    })
 }