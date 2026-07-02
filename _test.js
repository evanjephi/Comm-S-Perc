
const commPct = 10;
const totalAmt = 150;
const overage = 20;

const commission = (commPct / 100) * totalAmt;
const totalCom = commission + overage;

console.log("1) Basic:", { commission, totalCom });
// 2) array of sales transactions
const transactions = [
	{ id: 1, rep: "Ana", amount: 500, commPct: 8, status: "PAID" },
	{ id: 2, rep: "Ana", amount: 1200, commPct: 10, status: "PAID" },
	{ id: 3, rep: "Ben", amount: 300, commPct: 7, status: "VOID" },
	{ id: 4, rep: "Ben", amount: 950, commPct: 9, status: "PAID" },
	{ id: 5, rep: "Cara", amount: 700, commPct: 8, status: "PAID" },
	{ id: 6, rep: "Cara", amount: 700, commPct: 8, status: "PAID" }, // duplicate style row for dedupe practice
];

const paidTransactions = transactions.filter((t) => t.status === "PAID");

const withCommission = paidTransactions.map((t) => ({
	...t,
	commission: (t.commPct / 100) * t.amount,
}));

const totalCommission = withCommission.reduce((sum, t) => sum + t.commission, 0);

console.log("2) Paid count:", paidTransactions.length);
console.log("2) Total commission:", totalCommission);

// 3) Group by rep and summarize
const summaryByRep = withCommission.reduce((acc, t) => {
	if (!acc[t.rep]) {
		acc[t.rep] = { rep: t.rep, sales: 0, commission: 0, txnCount: 0 };
	}

	acc[t.rep].sales += t.amount;
	acc[t.rep].commission += t.commission;
	acc[t.rep].txnCount += 1;
	return acc;
}, {});

const summaryList = Object.values(summaryByRep).sort((a, b) => b.commission - a.commission);
console.log("3) Summary by rep:", { summaryByRep, summaryList });

// 4) Deduplicate by key (example: same rep + amount)
const uniqueByRepAndAmount = [];
const seen = new Set();

for (const t of withCommission) {
	const key = `${t.rep}-${t.amount}`;
	if (!seen.has(key)) {
		seen.add(key);
		uniqueByRepAndAmount.push(t);
	}
}

console.log("4) Unique transactions:", uniqueByRepAndAmount.length);


// 5)  functionsSuiteScripts

function safeNumber(value, fallback = 0) {
	const n = Number(value);
	return Number.isNaN(n) ? fallback : n;
}

function sumBy(list, getter) {
	return list.reduce((sum, item) => sum + safeNumber(getter(item), 0), 0);
}

function groupBy(list, keyGetter) {
	return list.reduce((acc, item) => {
		const key = keyGetter(item);
		if (!acc[key]) acc[key] = [];
		acc[key].push(item);
		return acc;
	}, {});
}

const grouped = groupBy(withCommission, (t) => t.rep);
const anaTotal = sumBy(grouped.Ana || [], (t) => t.commission);

console.log("5) Ana total commission:", anaTotal);


// Task 1: Add a new transaction for "D" and include it in the summary.
// Task 2: Add a rule: if amount > 1000, add 15 overage to that transaction's commission.
// Task 3: Create topRep variable with the highest total commission.
// Task 4: Return only reps with total sales >= 1000.
