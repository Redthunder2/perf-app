# Video Chat App

A simple ASP.NET Core web application for video and text chat using SignalR and WebRTC.

## Features

- **Real-time Text Chat**: Send and receive messages instantly with other users
- **Video Calling**: Peer-to-peer video calls using WebRTC
- **Audio Controls**: Mute/unmute microphone during calls
- **Video Controls**: Turn camera on/off during calls
- **Responsive Design**: Works on desktop and mobile devices
- **Simple Interface**: Clean, intuitive user interface

## Technologies Used

- **Backend**: ASP.NET Core 6.0
- **Real-time Communication**: SignalR for messaging and WebRTC signaling
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Video/Audio**: WebRTC for peer-to-peer communication
- **UI Framework**: Bootstrap 5
- **Libraries**: jQuery, SignalR JavaScript client

## Prerequisites

- .NET 6.0 SDK or later
- A modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)

## How to Run

### Option 1: Using the Start Script (Recommended)

1. **Navigate to the ChatAppCore directory**
   ```bash
   cd /workspace/ChatAppCore
   ```

2. **Run the start script**
   ```bash
   ./start-chat-app.sh
   ```

### Option 2: Manual Commands

1. **Navigate to the ChatAppCore directory**
   ```bash
   cd /workspace/ChatAppCore
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore ChatApp.csproj
   ```

3. **Build the application**
   ```bash
   dotnet build ChatApp.csproj
   ```

4. **Run the application**
   ```bash
   dotnet run --project ChatApp.csproj --urls="http://0.0.0.0:5000"
   ```

### Access the Application

5. **Open your browser** and navigate to `http://localhost:5000`

6. **Grant camera and microphone permissions** when prompted by your browser

## Usage

1. **Enter your name** when prompted
2. **Send text messages** using the chat panel on the right
3. **Start a video call** by clicking the "Start Call" button
4. **Control your audio/video** using the Mute and Video buttons
5. **End the call** by clicking the "End Call" button

## Project Structure

```
ChatAppCore/
├── ChatApp.csproj          # Project file
├── Program.cs              # Application entry point
├── start-chat-app.sh       # Start script
├── Hubs/
│   └── ChatHub.cs          # SignalR hub for real-time communication
├── Controllers/
│   └── HomeController.cs   # MVC controller
├── Models/
│   └── ErrorViewModel.cs   # Error view model
├── Views/
│   ├── _ViewStart.cshtml   # View configuration
│   ├── _ViewImports.cshtml # View imports
│   ├── Shared/
│   │   └── _Layout.cshtml  # Shared layout
│   └── Home/
│       ├── Index.cshtml    # Home page
│       └── Chat.cshtml     # Chat interface
└── wwwroot/
    ├── css/
    │   └── site.css        # Custom styles
    ├── js/
    │   ├── site.js         # Global JavaScript
    │   └── chat.js         # Chat functionality
    └── lib/                # Client-side libraries
```

## Features in Detail

### Text Chat
- Real-time messaging using SignalR
- Messages appear instantly for all connected users
- Visual distinction between your messages and others
- System messages for user join/leave events

### Video Chat
- Peer-to-peer video calls using WebRTC
- Automatic camera and microphone access
- Local video preview in bottom-right corner
- Remote video fills the main video area
- Connection status indicator

### Controls
- **Start Call**: Initiates a video call with other users
- **End Call**: Terminates the current video call
- **Mute/Unmute**: Toggle microphone on/off
- **Video On/Off**: Toggle camera on/off

## Browser Compatibility

- Chrome 60+
- Firefox 60+
- Safari 11+
- Edge 79+

## Security Notes

- This is a demo application for learning purposes
- In production, consider implementing:
  - User authentication
  - Room-based access control
  - TURN servers for NAT traversal
  - HTTPS enforcement
  - Input validation and sanitization

## Troubleshooting

### Camera/Microphone Access Denied
- Check browser permissions for camera and microphone
- Ensure you're using HTTPS in production
- Some browsers require user interaction before media access

### Connection Issues
- Check firewall settings
- Ensure SignalR can establish WebSocket connections
- For production deployments, consider using TURN servers

### Build Errors
- Ensure .NET 6.0 SDK is installed
- Run `dotnet restore` to restore NuGet packages
- Check that all required files are present

## Development Notes

- The application uses a simple one-room chat system
- Multiple users can join the same room and chat
- Video calls work between two users at a time
- The application includes error handling and connection status indicators

## License

This project is provided as-is for educational purposes.