from app.services.chat_service import ChatService

chat = ChatService()

response = chat.ask(
    "How do I request maintenance?"
)

print()

print(response["answer"])

print()

print(response["sources"])