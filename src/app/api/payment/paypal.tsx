export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://refashioned.onrender.com/api/payment/paypal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.headers.authorization}`,
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to initiate PayPal payment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}