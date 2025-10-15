from django.urls import path
from .views import *

urlpatterns = [
    path('create-room/', CreateRoomView, name="create"),
    path('join/', JoinRoomView, name="join"),
    path('', GetRoomView, name="get-room"),
    path('update/', UpdateRoomView, name="update"),
    path('callback/', spotify_callback, name="callback"),  
    path('login/', spotify_login, name="login"),
    path('isAuthenticated/', is_authenticated),
    path('get-token/',get_token),
    path('<str:code>/', GetRoomView),  # ← move to the bottom
]
