from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os

app = FastAPI()

# # Add CORS middleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv()
openai_key = os.getenv("OPENAI_API_KEY") # put your openai key here as a string. Example: "sk-proj-1234567890"

@app.post("/chat")
async def process_chat_message(request: Request):
    try:
        data = await request.json()
        # TODO: add the code here to process the chat message and return the response
        return {"response": {f'Recieved data: {data}'}}
            
    except Exception as e:
        print(f"Error in chat completion: {str(e)}")
        return {"response": f"Error: {str(e)}", "error": True}
    

if __name__ == '__main__':
    host = 'localhost'
    port = 8000
    uvicorn.run(app, host=host, port=port)