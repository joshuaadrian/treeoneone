import { Resend } from 'resend';

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

        // Initialize Resend with API key
        const resend = new Resend(context.env.RESEND_API_KEY);

        // Send email using Resend SDK
        const data = await resend.emails.send({
            from: 'TreeOneOne <notifications@treeoneone.org>',
            to: [email],
            subject: 'Your Tree Request Has Been Cleaned Up!',
            html: `
                <h2>Your Tree Request Has Been Cleaned Up!</h2>
                <p>Hello,</p>
                <p>We're happy to inform you that the tree maintenance request you submitted for <strong>${address}</strong> has been completed.</p>
                <p>Thank you for using TreeOneOne!</p>
                <p>Best regards,<br>The TreeOneOne Team</p>
            `,
            text: `Hello,\n\nWe're happy to inform you that the tree maintenance request you submitted for ${address} has been completed.\n\nThank you for using TreeOneOne!\n\nBest regards,\nThe TreeOneOne Team`
        });

        return new Response(JSON.stringify({ success: true, data }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
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