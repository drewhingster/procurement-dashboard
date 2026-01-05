export async function onRequest(context) {
  const { request, env } = context;

  // GET all transactions
  if (request.method === "GET") {
    const { results } = await env.DB
      .prepare("SELECT * FROM transactions ORDER BY createdAt DESC")
      .all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // POST new or updated transaction
  if (request.method === "POST") {
    const txn = await request.json();

    await env.DB.prepare(`
      INSERT OR REPLACE INTO transactions
      (id, details, supplier, amount, rfqDate, closeDate,
       rfqStatus, quotesStatus, bidEvalStatus, approvalStatus,
       approvalDate, mtbNumber, poNumber, poSent, paymentMade,
       remarks, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      txn.id,
      txn.details,
      txn.supplier,
      txn.amount,
      txn.rfqDate,
      txn.closeDate,
      txn.rfqStatus,
      txn.quotesStatus,
      txn.bidEvalStatus,
      txn.approvalStatus,
      txn.approvalDate,
      txn.mtbNumber,
      txn.poNumber,
      txn.poSent ? 1 : 0,
      txn.paymentMade ? 1 : 0,
      txn.remarks,
      txn.createdAt,
      txn.updatedAt
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
