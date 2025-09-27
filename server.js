const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Système d'envoi d'email simple
function sendSimpleEmail(name, email, phone, service, message) {
  console.log('📧 EMAIL REÇU:');
  console.log('De:', name, `<${email}>`);
  console.log('Téléphone:', phone || 'Non renseigné');
  console.log('Service:', service || 'Non spécifié');
  console.log('Message:', message);
  console.log('---');
  console.log('📬 Email prêt à être envoyé à: louismonier13@gmail.com');
}

// Template HTML pour l'email
function createEmailTemplate(data) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message - PhotoParadis</title>
        <style>
            body {
                font-family: 'Inter', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f8f8;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #000000 0%, #333333 100%);
                color: #ffffff;
                padding: 30px;
                text-align: center;
            }
            .logo {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 10px;
            }
            .subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            .info-item {
                background-color: #f8f8f8;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #000000;
            }
            .info-label {
                font-weight: 600;
                color: #000000;
                margin-bottom: 5px;
            }
            .info-value {
                color: #666666;
            }
            .message-section {
                background-color: #f8f8f8;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            }
            .message-label {
                font-weight: 600;
                color: #000000;
                margin-bottom: 10px;
            }
            .message-content {
                color: #666666;
                white-space: pre-wrap;
            }
            .footer {
                background-color: #000000;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-size: 0.9rem;
            }
            .contact-info {
                margin-top: 15px;
                font-size: 0.8rem;
                opacity: 0.8;
            }
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">PhotoParadis</div>
                <div class="subtitle">Nouveau message reçu</div>
            </div>
            
            <div class="content">
                <h2 style="color: #000000; margin-bottom: 20px;">Nouveau message de contact</h2>
                
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nom complet</div>
                        <div class="info-value">${data.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${data.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Téléphone</div>
                        <div class="info-value">${data.phone || 'Non renseigné'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Service concerné</div>
                        <div class="info-value">${data.service || 'Non spécifié'}</div>
                    </div>
                </div>
                
                <div class="message-section">
                    <div class="message-label">Message :</div>
                    <div class="message-content">${data.message}</div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>PhotoParadis</strong> - Photographie Professionnelle & Événementielle</p>
                <div class="contact-info">
                    <p>📞 04 42 77 17 91 | 📧 contact@photoparadis.fr</p>
                    <p>📍 23, Boulevard de la Libération, 13700 Marignane</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Route pour servir les fichiers statiques
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour envoyer l'email
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validation des données
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Les champs nom, email et message sont obligatoires' 
      });
    }

    // Création du template email
    const emailHtml = createEmailTemplate({
      name,
      email,
      phone,
      service,
      message
    });

    // Envoi de l'email simple
    sendSimpleEmail(name, email, phone, service, message);
    
    res.json({ 
      success: true, 
      message: 'Message reçu avec succès ! Nous vous répondrons rapidement.' 
    });

  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
    });
  }
});

// Démarrage du serveur
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Serveur PhotoParadis démarré sur le port ${PORT}`);
  console.log(`📧 Emails de contact envoyés à: ${config.contactEmail}`);
  console.log(`🌐 Site accessible sur: http://localhost:${PORT}`);
});

module.exports = app;
