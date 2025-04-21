import { NextApiRequest, NextApiResponse } from 'next';
import { getKVNamespace } from '@cloudflare/workers-types';

interface RequestData {
  address: string;
  description: string;
  photo: string;
  date: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, description, photo, date } = req.body as RequestData;

    if (!address || !description || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the KV namespace
    const REQUESTS = (process.env.REQUESTS as unknown) as KVNamespace;

    // Generate a unique ID for the request
    const id = Date.now().toString();

    // Store the request in KV
    await REQUESTS.put(id, JSON.stringify({
      address,
      description,
      photo,
      date,
      status: 'pending'
    }));

    // Send email notification using Cloudflare Email Workers
    const emailResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/email/rules', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'new-request-notification',
        enabled: true,
        matchers: [
          {
            type: 'all',
            field: 'to',
            value: 'notifications@treeoneone.org'
          }
        ],
        actions: [
          {
            type: 'forward',
            value: ['admin@treeoneone.org']
          }
        ],
        priority: 0
      })
    });

    if (!emailResponse.ok) {
      console.error('Failed to set up email notification:', await emailResponse.text());
    }

    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 