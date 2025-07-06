
let janus = null;
let opaqueId = "videoroomtest-" + Janus.randomString(12);

function startCall() {
  const role = document.getElementById("role").value;
  if (role === "presenter") {
    startPresenter();
  } else {
    startViewer();
  }
}

function startPresenter() {
  Janus.init({
    debug: "all",
    callback: function () {
      janus = new Janus({
        server: "https://dev-live-cast-wrtc.transperfect.com:8089/janus",
        success: function () {
          janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: opaqueId,
            success: function (pluginHandle) {
              const videoRoom = pluginHandle;
              const register = {
                request: "join",
                room: 1234,
                ptype: "publisher",
                display: "Presenter_" + Janus.randomString(4)
              };
              videoRoom.send({ message: register });

              navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(function (stream) {
                  Janus.attachMediaStream(document.getElementById("localVideo"), stream);
                  videoRoom.createOffer({
                    media: { stream: stream },
                    success: function (jsep) {
                      videoRoom.send({
                        message: { request: "publish", audio: true, video: true },
                        jsep: jsep
                      });
                      console.log("Publishing stream to room 1234...");
                    },
                    error: function (error) {
                      console.error("WebRTC createOffer error:", error);
                    }
                  });
                });
            }
          });
        }
      });
    }
  });
}

function startViewer() {
    Janus.init({
      debug: "all",
      callback: function () {
        janus = new Janus({
          server: "https://dev-live-cast-wrtc.transperfect.com:8089/janus",
          success: function () {
            janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle) {
                const listenerHandle = pluginHandle;
  
                console.log("Viewer attached. Waiting for publishers...");
  
                listenerHandle.send({
                  message: {
                    request: "join",
                    room: 1234,
                    ptype: "subscriber"
                    // No 'feed' yet — just listening
                  }
                });
  
                listenerHandle.onmessage = function (msg, jsep) {
                  console.log("Full viewer message:", msg);
  
                  if (msg["publishers"] && msg["publishers"].length > 0) {
                    msg["publishers"].forEach((p) => {
                      console.log("📡 Found publisher:", p.id);
                      subscribeToPublisher(p.id); //Subscribe using a second handle
                    });
                  }
  
                  if (msg["leaving"]) {
                    console.log("Publisher left. ID:", msg["leaving"]);
                  }
                };
              },
              error: function (error) {
                console.error("Viewer plugin attach error:", error);
              }
            });
          },
          error: function (err) {
            console.error("Janus init error:", err);
          }
        });
      }
    });
  }

  function subscribeToPublisher(feedId) {
    janus.attach({
      plugin: "janus.plugin.videoroom",
      success: function (pluginHandle) {
        const remoteFeed = pluginHandle;
  
        remoteFeed.send({
          message: {
            request: "join",
            room: 1234,
            ptype: "subscriber",
            feed: feedId
          }
        });
  
        remoteFeed.onmessage = function (msg, jsep) {
          if (jsep) {
            remoteFeed.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false },
              success: function (jsepAnswer) {
                remoteFeed.send({
                  message: { request: "start", room: 1234 },
                  jsep: jsepAnswer
                });
              },
              error: function (err) {
                console.error("createAnswer error:", err);
              }
            });
          }
        };
  
        remoteFeed.onremotestream = function (stream) {
          console.log("Viewer received remote stream");
          Janus.attachMediaStream(document.getElementById("remoteVideo"), stream);
        };
      },
      error: function (err) {
        console.error("Error attaching to remote feed:", err);
      }
    });
  }
  


  
  
    
  
