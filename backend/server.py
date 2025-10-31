from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

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
from openai import OpenAI
client = OpenAI()

# You can also use the InferenceClient from Hugging Face to use the gpt-oss-20b model in case you don't have access to the OpenAI API and have only a Hugging Face API key
# from huggingface_hub import InferenceClient
# client = InferenceClient("openai/gpt-oss-20b")

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
document = SimpleDirectoryReader("frontend/static_pages").load_data()
index = VectorStoreIndex.from_documents(document)
retriever = index.as_retriever()

system_prompt = "You are a helpful assistant that can answer questions and help with tasks. You are only allowed to answer questions using the context provided to you. In case you are not sure about the answer just reply back by saying 'I don't know"
@app.post("/chat")
async def process_chat_message(request: Request):
    try:
        data = await request.json()
        message = data["message"]
        context = retriever.retrieve(message)
        print(context)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Context: " + str(context) + "\n\n" + "Users questions: " + message}
            ]
        )
        return {"response": response.choices[0].message.content}
            
    except Exception as e:
        print(f"Error in chat completion: {str(e)}")
        return {"response": f"Error: {str(e)}", "error": True}
    

if __name__ == '__main__':
    host = 'localhost'
    port = 8000
    uvicorn.run(app, host=host, port=port)