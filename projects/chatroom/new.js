document.getElementById("message_box").addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
        const res = await fetch(form.action, {
            method: form.method,
            body: data
        });

        if (!res.ok) throw new Error("Network error");
        const text = await res.text();

        console.log("Succeeded!");
    } catch (err) {
        console.log("Failed!");
    }
})