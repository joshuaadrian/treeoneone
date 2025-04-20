export async function onRequestPost(context) {
    try {
        const data = await context.request.json();
        
        // Get the KV namespace
        const requests = context.env.REQUESTS;
        
        // Get existing requests
        let existingRequests = [];
        try {
            const storedRequests = await requests.get('requests');
            if (storedRequests) {
                existingRequests = JSON.parse(storedRequests);
            }
        } catch (e) {
            console.error('Error reading existing requests:', e);
        }
        
        // Add new request
        existingRequests.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        
        // Save updated requests
        await requests.put('requests', JSON.stringify(existingRequests));
        
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