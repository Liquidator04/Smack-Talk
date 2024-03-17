let APP_ID = "33d1f28250bd42259f2db5b65e09cb83"

let token = null;
let uid = String(Math.floor(Math.random()*10000))

let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')

if(!roomId){
    window.location = 'lobby.html'
}

let localStream;
let remoteStream;
let peerConnection;

let client;
let channel;

const servers = {
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
    ]
}

let init = async() => {
    client = await AgoraRTM.createInstance(APP_ID)
    await client.login({uid, token})

    channel = client.createChannel(roomId)
    await channel.join()

    channel.on('MemberJoined', handleUserJoined)
    channel.on('MemberLeft', handleUserLeft)

    client.on('MessageFromPeer', handleMessageFromPeer)

    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream

}

let handleUserLeft = (MemberId) =>{
    document.getElementById('user-2').style.display = 'none'
}

let handleMessageFromPeer = async(message, MemberId) => {

    message = JSON.parse(message.text)

    if(message.type === 'offer'){
        createAnswer(MemberId, message.offer)
    }

    if(message.type === 'answer'){
        addAnswer(message.answer)
    }

    if(message.type === 'candidate'){
        if(peerConnection){
            peerConnection.addIceCandidate(message.candidate)
        }
    }
}

let handleUserJoined = async (MemberId) => {
    
    console.log('A new user joined the channel: ', MemberId)

    createOffer(MemberId)
    
}

let createPeerConnection = async (MemberId) => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream
    document.getElementById('user-2').style.display = 'block'

    if(!localStream){
        localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
        document.getElementById('user-1').srcObject = localStream
    }

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (event) =>{
        if(event.candidate){
            client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate': event.candidate})}, MemberId)
        }
    }
    runTimer();
}
 
let createOffer = async(MemberId) => {
    await createPeerConnection(MemberId)

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer': offer})}, MemberId)
}

let createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId)

    await peerConnection.setRemoteDescription(offer)

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer': answer})}, MemberId)
}

let addAnswer = async (answer) =>{
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}

let leaveChannel = async ()=>{
    await channel.leave()
    await client.logout()
}

window.addEventListener('beforeunload', leaveChannel)

// var time = 30;
let interval;
// var currTurn=1;
async function runTimer() {
    document.getElementById('which-player').innerHTML = "Player 1"
    await startTimer(30);
    document.getElementById('Timer').innerHTML = ("Times Up");
    await delay(5000); // Wait for 5 seconds
    document.getElementById('which-player').innerHTML = "Player 2"
    await startTimer(30);
    document.getElementById('Timer').innerHTML = ("Times Up");
    await delay(5000); // Wait for 5 seconds
    document.getElementById('which-player').innerHTML = "Time for all out war"
    await startTimer(120);
}

async function startTimer(totalSeconds) {
    let remainingTime = totalSeconds;

    while (remainingTime >= 0) {
        document.getElementById('Timer').innerHTML = (formatTime(remainingTime));
        await delay(1000); // Wait for 1 second
        remainingTime--;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the timer




init()