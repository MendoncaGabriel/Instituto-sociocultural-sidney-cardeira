async function Fetch(endpoint, method, body){
    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        const status = response.status;
        const data = await response.json();

        return { status: status, data: data };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}
