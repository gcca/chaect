import asyncio
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

websockets: List[WebSocket] = []


class ConnectionManager:
    def __init__(self) -> None:
        self.websockets = []

    async def Connect(self, websocket):
        await websocket.accept()
        self.websockets.append(websocket)

    def Disconnect(self, websocket):
        self.websockets.remove(websocket)

    async def Broadcast(self, message):
        await asyncio.gather(
            *(websocket.send_text(message) for websocket in self.websockets)
        )


manager = ConnectionManager()


@app.websocket("/")
async def chatsocket(websocket: WebSocket):
    await manager.Connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            await manager.Broadcast(message)
    except WebSocketDisconnect:
        manager.Disconnect(websocket)
