document.addEventListener('DOMContentLoaded', async function() {
    const requestsList = document.getElementById('too--requests');
    const totalRequests = document.getElementById('too--requests--total');

    async function fetchRequests() {
        try {
            const response = await fetch('/api/requests');
            if (!response.ok) throw new Error('Failed to fetch requests');
            
            const requests = await response.json();
            return requests;
        } catch (error) {
            console.error('Error fetching requests:', error);
            return [];
        }
    }

    async function deleteRequest(request) {
        try {
            const response = await fetch(`/api/delete-request?timestamp=${encodeURIComponent(request.timestamp)}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete request');

            // Send email notification if email was provided
            if (request.email) {
                try {
                    await fetch('/api/send-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: request.email,
                            address: request.address,
                            timestamp: request.timestamp
                        })
                    });
                } catch (emailError) {
                    console.error('Failed to send email notification:', emailError);
                    // Don't show error to user as the main action (deletion) was successful
                }
            }
            
            // Refresh the requests list
            await displayRequests();
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Failed to delete request. Please try again.');
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function createRequestElement(request) {
        const li = document.createElement('li');
        li.className = 'too--request';
        
        const date = document.createElement('span');
        date.className = 'too--request--date';
        date.textContent = formatDate(request.timestamp);
        
        const address = document.createElement('span');
        address.className = 'too--request--address';
        address.textContent = request.address;
        
        const description = document.createElement('span');
        description.className = 'too--request--description';
        description.textContent = request.description;
        
        const actions = document.createElement('span');
        actions.className = 'too--request--actions buttons';
        
        const button = document.createElement('div');
        button.className = 'button is-style-outline';
        
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'button--link';
        link.innerHTML = '<span>Cleaned Up</span>';
        
        // Add click handler for deletion
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to mark this request as cleaned up?')) {
                deleteRequest(request);
            }
        });
        
        button.appendChild(link);
        actions.appendChild(button);
        
        li.appendChild(date);
        li.appendChild(address);
        li.appendChild(description);
        li.appendChild(actions);

        // Add photo if available
        if (request.photo) {
            const photo = document.createElement('img');
            photo.src = request.photo;
            photo.className = 'too--request--photo';
            photo.alt = 'Request photo';
            li.appendChild(photo);
        }
        
        return li;
    }

    async function displayRequests() {
        const requests = await fetchRequests();
        
        // Update total count
        if (totalRequests) {
            totalRequests.textContent = requests.length;
        }
        
        // Clear existing requests
        if (requestsList) {
            requestsList.innerHTML = '';
            
            // Add each request to the list
            requests.forEach(request => {
                const requestElement = createRequestElement(request);
                requestsList.appendChild(requestElement);
            });
        }
    }

    // Initial load
    await displayRequests();
    
    // Refresh every 30 seconds
    setInterval(displayRequests, 30000);
}); 