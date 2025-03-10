export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phone, amount } = req.body;

    try {
      const response = await fetch('https://refashioned.onrender.com/api/mpesa/stk-push/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.headers.authorization}`,
        },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to initiate M-Pesa payment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}