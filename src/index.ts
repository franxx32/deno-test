import { serve } from "https://deno.land/std@0.176.0/http/server.ts";

let port = parseInt(Deno.env.get("PORT") ?? "8000");
console.log(`http://localhost:${port}/`);

function logError(msg: string) {
  console.log(msg);
  Deno.exit(1);
}
function handleConnected() {
  console.log("Connected to client ...");
}
function handleMessage(ws: WebSocket, data: string) {
  console.log("CLIENT >> " + data);
  const reply = prompt("Server >> ") || "No reply";
  if (reply === "exit") {
    return ws.close();
  }
  ws.send(reply as string);
}
function handleError(e: Event | ErrorEvent) {
  console.log(e instanceof ErrorEvent ? e.message : e.type);
}
async function reqHandler(req: Request) {
  console.log(1);
  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  ws.onopen = () => handleConnected();
  ws.onmessage = (m) => handleMessage(ws, m.data);
  ws.onclose = () => logError("Disconnected from client ...");
  ws.onerror = (e) => handleError(e);
  return response;
}
console.log("Waiting for client ...");
serve(reqHandler, { port });