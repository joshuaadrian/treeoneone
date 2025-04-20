export async function onRequestPost(context) {
    try {
        const { email, address, timestamp } = await context.request.json();

        if (!email || !address || !timestamp) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // Create email message
        const message = {
            from: "TreeOneOne <notifications@treeoneone.org>",
            to: email,
            subject: "Your Tree Request Has Been Cleaned Up!",
            text: `Hello,\n\nWe're happy to inform you that the tree maintenance request you submitted for ${address} has been completed.\n\nThank you for using TreeOneOne!\n\nBest regards,\nThe TreeOneOne Team`,
            html: `
                <h2>Your Tree Request Has Been Cleaned Up!</h2>
                <p>Hello,</p>
                <p>We're happy to inform you that the tree maintenance request you submitted for <strong>${address}</strong> has been completed.</p>
                <p>Thank you for using TreeOneOne!</p>
                <p>Best regards,<br>The TreeOneOne Team</p>
            `
        };

        // Send email using Cloudflare Email Workers
        const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: message.to }],
                    },
                ],
                from: {
                    email: message.from.split(' ')[1].slice(1, -1),
                    name: message.from.split(' ')[0],
                },
                subject: message.subject,
                content: [
                    {
                        type: 'text/plain',
                        value: message.text,
                    },
                    {
                        type: 'text/html',
                        value: message.html,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
} 