<!DOCTYPE html>
<html>
<head>
  <title>Janus WebRTC Test</title>
</head>
<body>
  <h2>Janus WebRTC Test</h2>

  <label>Select Role: </label>
  <select id="role">
    <option value="presenter">Presenter</option>
    <option value="viewer">Viewer</option>
  </select>
  <button onclick="startCall()">Start Call</button>

  <div id="video-container" style="display: flex; gap: 20px; margin-top: 20px;">
    <video id="localVideo" autoplay muted style="width: 50%; border: 2px solid #ccc;"></video>
    <video id="remoteVideo" autoplay style="width: 50%; border: 2px solid #ccc;"></video>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.2.3/adapter.min.js"></script>
  <script src="https://janus.conf.meetecho.com/demos/janus.js"></script>
  <script src="{{ asset('js/video.js') }}"></script>
</body>
</html>
