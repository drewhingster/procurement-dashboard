async function saveRecord() {
  const payload = {
    supplier: document.getElementById("supplier").value,
    item: document.getElementById("item").value,
    amount: document.getElementById("amount").value
  };

  await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Saved to database");
}
