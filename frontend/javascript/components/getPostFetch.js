const getMethodFetch = (url) => {
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Hiba: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw new Error(`Hiba történt: ${error.message}`);
        });
};
const postFetchForm = async (url, formData) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Error: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('POST form request error:', error);
        throw error;
    }
};
const postFetch = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || 'Error ' + response.status + ' ' + response.statusText
            );
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteFetch = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('hiba' + response.statusText + '(' + response.status + ')');
        }
        return await response.json();
    } catch (error) {
        throw new Error('hiba: ' + error.message);
    }
};
