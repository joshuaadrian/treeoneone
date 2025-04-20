export async function onRequestDelete(context) {
    try {
        const requests = context.env.REQUESTS;
        const { searchParams } = new URL(context.request.url);
        const timestamp = searchParams.get('timestamp');

        if (!timestamp) {
            return new Response(JSON.stringify({ error: 'Timestamp parameter is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // Get existing requests
        const storedRequests = await requests.get('requests');
        let requestsList = storedRequests ? JSON.parse(storedRequests) : [];

        // Filter out the request with matching timestamp
        requestsList = requestsList.filter(request => request.timestamp !== timestamp);

        // Save updated list
        await requests.put('requests', JSON.stringify(requestsList));

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
} 