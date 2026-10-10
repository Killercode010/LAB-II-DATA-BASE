const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { getConfig } = require('./config');

const MIN_YEAR = 1970;
const MAX_YEAR = 2026;

function isValidRow(record) {
  if (!record.Name || !record.Platform || !record.Genre || !record.Publisher) {
    return false;
  }
  if (record.Genre === 'N/A' || record.Publisher === 'N/A') {
    return false;
  }
  const year = Number(record.Year);
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

function parseSales(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function loadRows() {
  const { csvPath } = getConfig();
  const content = fs.readFileSync(csvPath, 'utf8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  const rows = [];
  let skipped = 0;

  for (const record of records) {
    if (!isValidRow(record)) {
      skipped += 1;
      continue;
    }
    rows.push({
      name: record.Name.trim(),
      platform: record.Platform.trim(),
      year: Number(record.Year),
      genre: record.Genre.trim(),
      publisher: record.Publisher.trim(),
      naSales: parseSales(record.NA_Sales),
      jpSales: parseSales(record.JP_Sales),
      globalSales: parseSales(record.Global_Sales),
    });
  }

  return { rows, skipped };
}

module.exports = { loadRows };
