# Janus WebRTC 1-to-1 Video Call

A Laravel-based video calling app using Janus WebRTC server for one-to-one video streaming.

---

## 📦 Tech Stack

- Laravel (PHP backend)
- Janus WebRTC (media server)
- JavaScript (frontend)
- Blade (templating)

---

## 📁 Project Structure

- `routes/web.php` — defines `/video` route
- `resources/views/video.blade.php` — frontend UI with role selector
- `public/js/video.js` — handles Janus WebRTC logic (presenter/viewer)
- `.env.example` — environment setup

---

## ⚙️ How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/sapanand/janus-video-call.git
cd janus-video-call
