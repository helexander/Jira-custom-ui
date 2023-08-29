export const handleFetchError = (content) => {
    console.error(`Failed to get ${content}`);
};

export const handleFetchSuccess = (data, content, setFunc) => {
    if (data.length === 0) {
        throw new Error(`No ${content} returned`);
    }
    setFunc(data);
}