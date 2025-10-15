from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from django.http import HttpResponse
from .models import Room
from .serializers import RoomSerializer
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv

load_dotenv()



FRONTEND_URL = os.getenv("FRONTEND_URL", "https://auditive-unsegmentally-karter.ngrok-free.dev")
REDIRECT_URI = f"{FRONTEND_URL}/api/room/callback"
# Initialize Spotify OAuth
sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    scope="user-read-playback-state user-modify-playback-state"
)


@api_view(['POST'])
def CreateRoomView(request):
    if not request.session.get('is_authenticated', False):
        return Response({'error': 'User not authenticated with Spotify'}, status=401)

    serializer = RoomSerializer(data=request.data)
    if serializer.is_valid():
        room = serializer.save()
        room.host = request.session.session_key
        room.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def JoinRoomView(request):
    code = request.data.get('code')
    try:
        room = Room.objects.get(code=code)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Room.DoesNotExist:
        return Response({'error': 'Invalid room code'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def GetRoomView(request,code):
    code = request.GET.get('code')
    try:
        room = Room.objects.get(code=code)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
def UpdateRoomView(request):
    code = request.data.get('code')
    try:
        room = Room.objects.get(code=code)
        serializer = RoomSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)






# Initialize Spotify OAuth
sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri="https://auditive-unsegmentally-karter.ngrok-free.dev/api/room/callback",
    scope="user-read-playback-state user-modify-playback-state"
)

@api_view(["GET"])
def spotify_login(request):
    print("✅ Login endpoint hit")  # confirm in terminal
    auth_url = sp_oauth.get_authorize_url()
    print("Redirecting to:", auth_url)
    return redirect(auth_url)


@api_view(["GET"])
def spotify_callback(request):
    print("callback called...")
    code = request.GET.get("code")
    

    if not code:
        return HttpResponse("Authorization failed: no code provided.", status=400)

    try:
        token_info = sp_oauth.get_access_token(code)
        

        if not token_info or "access_token" not in token_info:
            return HttpResponse("Failed to obtain access token.", status=400)

        request.session["token_info"] = token_info
        request.session["is_authenticated"] = True

        return redirect(f"http://localhost:5173/create")
    except Exception as e:
        print("Error during token exchange:", str(e))  # Log errors
        return HttpResponse(f"Error during token exchange: {str(e)}", status=400)

@api_view(["GET"])
def is_authenticated(request):
    """
    Checks if the user has an active Spotify token in session.
    """
    token_info = request.session.get("token_info")
    
    is_auth = token_info is not None
    print(is_auth)
    return Response({"status": is_auth})


@api_view(["GET"])
def get_token(request):
    token_info = request.session.get("token_info")
    
    if token_info and "access_token" in token_info:
        return Response({"access_token": token_info["access_token"]}, status=200)
    return Response({"error": "No valid token found"}, status=401)