export async function sendMessageToGemini(message) {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to get Gemini response");
        }

        return data.reply;
    } catch (error) {
        console.error("Gemini service error:", error);
        throw error;
    }
}