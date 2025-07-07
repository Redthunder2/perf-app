using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("UserJoined", Context.ConnectionId);
        }

        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("UserLeft", Context.ConnectionId);
        }

        public async Task SendSignal(string roomId, string signal, string targetConnectionId)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveSignal", signal, Context.ConnectionId);
        }

        public async Task SendOffer(string roomId, string offer, string targetConnectionId)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveOffer", offer, Context.ConnectionId);
        }

        public async Task SendAnswer(string roomId, string answer, string targetConnectionId)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveAnswer", answer, Context.ConnectionId);
        }

        public async Task SendIceCandidate(string roomId, string candidate, string targetConnectionId)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveIceCandidate", candidate, Context.ConnectionId);
        }
    }
}