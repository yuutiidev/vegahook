const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;  // Você pode mudar a porta conforme necessário

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Rota para processar os dados do webhook
app.post('/webhook', async (req, res) => {
    try {
        const webhookData = req.body;

        // Aqui você processa os dados recebidos do webhook
        const messageData = processWebhookData(webhookData);
        
        // Enviar a mensagem para o WhatsApp
        await sendMessageToWhatsApp(messageData);

        // Responde com sucesso para a plataforma que enviou o webhook
        res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
        res.status(500).json({ message: 'Erro ao processar o webhook' });
    }
});

// Função para processar os dados do webhook e formatar a mensagem
function processWebhookData(data) {
    const customerName = data.customer.name;
    const customerEmail = data.customer.email;
    const customerPhone = data.customer.phone;
    const totalPrice = data.total_price;

    const message = `
    Olá ${customerName},
    
    Seu pedido está abandonado no valor de R$ ${totalPrice}.
    Caso tenha algum problema ou queira concluir sua compra, clique no link abaixo para recuperar seu carrinho:
    ${data.abandoned_checkout_url}
    
    Detalhes do seu pedido:
    - Nome: ${customerName}
    - Email: ${customerEmail}
    - Telefone: ${customerPhone}
    
    Agradecemos a preferência!`;

    return {
        phone: "5595981216353",  // Número do destinatário
        message: message,
    };
}

// Função para enviar a mensagem via API do WhatsApp
async function sendMessageToWhatsApp(messageData) {
    const url = 'https://api.z-api.io/instances/3DE97A0F92A2607B9B2E4AF752FBD4C9/token/641846395793C0A44D66B39C/send-text';
    const headers = {
        'Client-Token': 'F23e1229e5b61433c9970c6e66b7e8692S',
    };

    try {
        await axios.post(url, messageData, { headers });
        console.log('Mensagem enviada com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
    }
}

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor está rodando na porta ${port}`);
});
