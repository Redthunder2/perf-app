// Chat application using SignalR and WebRTC
class ChatApp {
    constructor() {
        this.connection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.currentUser = 'Guest';
        this.roomId = 'default-room';
        this.remoteConnectionId = null;
        this.isCallActive = false;
        this.isMuted = false;
        this.isVideoEnabled = true;
        
        this.initializeSignalR();
        this.initializeUI();
    }

    async initializeSignalR() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/chathub")
            .build();

        // Set up event handlers
        this.connection.on("ReceiveMessage", (user, message) => {
            this.displayMessage(user, message, false);
        });

        this.connection.on("UserJoined", (connectionId) => {
            this.displaySystemMessage(`User joined the chat`);
            this.remoteConnectionId = connectionId;
        });

        this.connection.on("UserLeft", (connectionId) => {
            this.displaySystemMessage(`User left the chat`);
            if (connectionId === this.remoteConnectionId) {
                this.endCall();
            }
        });

        this.connection.on("ReceiveOffer", async (offer, fromConnectionId) => {
            await this.handleOffer(offer, fromConnectionId);
        });

        this.connection.on("ReceiveAnswer", async (answer, fromConnectionId) => {
            await this.handleAnswer(answer, fromConnectionId);
        });

        this.connection.on("ReceiveIceCandidate", async (candidate, fromConnectionId) => {
            await this.handleIceCandidate(candidate, fromConnectionId);
        });

        try {
            await this.connection.start();
            console.log("SignalR Connected.");
            await this.connection.invoke("JoinRoom", this.roomId);
        } catch (err) {
            console.error("SignalR Connection failed: ", err);
        }
    }

    initializeUI() {
        // Show user modal on page load
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();

        // Join chat button
        document.getElementById('joinChatBtn').addEventListener('click', () => {
            const username = document.getElementById('userInput').value.trim();
            if (username) {
                this.currentUser = username;
                document.getElementById('currentUser').textContent = username;
                userModal.hide();
                this.displaySystemMessage(`Welcome to the chat, ${username}!`);
            }
        });

        // Send message button
        document.getElementById('sendButton').addEventListener('click', () => {
            this.sendMessage();
        });

        // Message input enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Video call buttons
        document.getElementById('startCallBtn').addEventListener('click', () => {
            this.startCall();
        });

        document.getElementById('endCallBtn').addEventListener('click', () => {
            this.endCall();
        });

        document.getElementById('muteBtn').addEventListener('click', () => {
            this.toggleMute();
        });

        document.getElementById('videoBtn').addEventListener('click', () => {
            this.toggleVideo();
        });
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message && this.connection) {
            await this.connection.invoke("SendMessage", this.currentUser, message);
            this.displayMessage(this.currentUser, message, true);
            messageInput.value = '';
        }
    }

    displayMessage(user, message, isOwnMessage) {
        const messagesList = document.getElementById('messagesList');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isOwnMessage ? 'own' : 'other'}`;
        
        messageElement.innerHTML = `
            <div class="message-header">${user}</div>
            <div class="message-content">${message}</div>
        `;
        
        messagesList.appendChild(messageElement);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    displaySystemMessage(message) {
        const messagesList = document.getElementById('messagesList');
        const messageElement = document.createElement('div');
        messageElement.className = 'system-message';
        messageElement.textContent = message;
        
        messagesList.appendChild(messageElement);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    async startCall() {
        try {
            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            document.getElementById('localVideo').srcObject = this.localStream;
            
            // Create peer connection
            this.peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            });

            // Add local stream
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            // Handle remote stream
            this.peerConnection.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    document.getElementById('remoteVideo').srcObject = event.streams[0];
                    this.updateConnectionStatus('Connected');
                }
            };

            // Handle ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.connection.invoke("SendIceCandidate", this.roomId, 
                        JSON.stringify(event.candidate), this.remoteConnectionId);
                }
            };

            // Create and send offer
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            await this.connection.invoke("SendOffer", this.roomId, 
                JSON.stringify(offer), this.remoteConnectionId);

            this.isCallActive = true;
            this.updateCallButtons();
            this.updateConnectionStatus('Calling...');
            
        } catch (error) {
            console.error('Error starting call:', error);
            this.displaySystemMessage('Error starting call. Please check your camera and microphone permissions.');
        }
    }

    async handleOffer(offer, fromConnectionId) {
        try {
            if (!this.peerConnection) {
                // Get user media
                this.localStream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                
                document.getElementById('localVideo').srcObject = this.localStream;
                
                // Create peer connection
                this.peerConnection = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' }
                    ]
                });

                // Add local stream
                this.localStream.getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, this.localStream);
                });

                // Handle remote stream
                this.peerConnection.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        document.getElementById('remoteVideo').srcObject = event.streams[0];
                        this.updateConnectionStatus('Connected');
                    }
                };

                // Handle ICE candidates
                this.peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.connection.invoke("SendIceCandidate", this.roomId, 
                            JSON.stringify(event.candidate), fromConnectionId);
                    }
                };
            }

            await this.peerConnection.setRemoteDescription(JSON.parse(offer));
            
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            await this.connection.invoke("SendAnswer", this.roomId, 
                JSON.stringify(answer), fromConnectionId);

            this.isCallActive = true;
            this.remoteConnectionId = fromConnectionId;
            this.updateCallButtons();
            this.updateConnectionStatus('Connecting...');
            
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    async handleAnswer(answer, fromConnectionId) {
        try {
            await this.peerConnection.setRemoteDescription(JSON.parse(answer));
            this.updateConnectionStatus('Connected');
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }

    async handleIceCandidate(candidate, fromConnectionId) {
        try {
            await this.peerConnection.addIceCandidate(JSON.parse(candidate));
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        document.getElementById('localVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;

        this.isCallActive = false;
        this.updateCallButtons();
        this.updateConnectionStatus('Disconnected');
        this.displaySystemMessage('Call ended');
    }

    toggleMute() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                this.isMuted = !audioTrack.enabled;
                
                const muteBtn = document.getElementById('muteBtn');
                muteBtn.textContent = this.isMuted ? 'Unmute' : 'Mute';
                muteBtn.classList.toggle('active', this.isMuted);
            }
        }
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                this.isVideoEnabled = videoTrack.enabled;
                
                const videoBtn = document.getElementById('videoBtn');
                videoBtn.textContent = this.isVideoEnabled ? 'Video Off' : 'Video On';
                videoBtn.classList.toggle('active', !this.isVideoEnabled);
            }
        }
    }

    updateCallButtons() {
        document.getElementById('startCallBtn').disabled = this.isCallActive;
        document.getElementById('endCallBtn').disabled = !this.isCallActive;
        document.getElementById('muteBtn').disabled = !this.isCallActive;
        document.getElementById('videoBtn').disabled = !this.isCallActive;
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        const badge = statusElement.querySelector('.badge');
        
        badge.textContent = status;
        badge.className = 'badge ' + this.getStatusClass(status);
    }

    getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'connected':
                return 'bg-success';
            case 'connecting...':
            case 'calling...':
                return 'bg-warning';
            case 'disconnected':
                return 'bg-secondary';
            default:
                return 'bg-secondary';
        }
    }
}

// Initialize the chat app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});